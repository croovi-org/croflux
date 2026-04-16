import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { generateRoadmapFromAI } from "@/lib/ai/aiClient";
import { parseRoadmapToDB } from "@/lib/ai/roadmapParser";
import { distributeDueDates } from "@/lib/scheduling/distributor";
import { validateInputLimits } from "@/lib/validation/inputLimits";
import { checkUsage } from "@/lib/usage/checkUsage";
import { updateUsage } from "@/lib/usage/updateUsage";

type GenerateRoadmapRequest = {
  name: string;
  idea: string;
  strategy?: string;
  workspace_name?: string;
  workspace_slug?: string;
  target_completion_date?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateRoadmapRequest>;
    const name = body.name?.trim();
    const idea = body.idea?.trim();
    const strategy = body.strategy?.trim();

    const validation = validateInputLimits({ text: idea });

    if (!validation.valid) {
      return Response.json(
        { success: false, error: validation.errors[0] },
        { status: 400 },
      );
    }

    if (!name || !idea) {
      return Response.json(
        { success: false, error: "name and idea are required" },
        { status: 400 },
      );
    }
    const workspaceName = body.workspace_name?.trim() || `${name} Workspace`;
    const workspaceSlug =
      body.workspace_slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    const targetCompletionDate = body.target_completion_date ?? null;
    const startDate = new Date().toISOString().split("T")[0];

    const serverSupabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = user.id;

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      throw new Error("Supabase environment variables are not configured");
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: usageSeedError } = await supabase.from("user_usage").upsert(
      {
        user_id: userId,
        roadmaps_generated_count: 0,
        total_words_processed: 0,
        total_documents_uploaded: 0,
      },
      { onConflict: "user_id" },
    );

    if (usageSeedError) {
      throw usageSeedError;
    }

    const usageCheck = await checkUsage(userId);
    const usage = {
      allowed: usageCheck.canGenerate,
      reason: usageCheck.canGenerate ? undefined : "Usage limit reached",
    };

    if (!usage.allowed) {
      return Response.json(
        { success: false, error: usage.reason },
        { status: 429 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        name,
        idea,
        strategy: strategy || null,
        product_stage: "mvp",
        workspace_name: workspaceName,
        workspace_slug: workspaceSlug,
        target_completion_date: targetCompletionDate,
        start_date: startDate,
      })
      .select()
      .single();

    if (projectError || !project) {
      throw projectError ?? new Error("Failed to create project");
    }

    const endDate = targetCompletionDate
      ? new Date(targetCompletionDate)
      : new Date(new Date(startDate).getTime() + 60 * 86400000);
    const durationDays = Math.max(
      7,
      Math.round(
        (endDate.getTime() - new Date(startDate).getTime()) / 86400000,
      ),
    );
    const systemPrompt = `
You are an expert startup execution planner.

Project context:
- Duration: ${durationDays} days to complete
- Today's date: ${startDate}

Return ONLY valid JSON matching this exact schema:

{
  "project_summary": string,
  "milestones": [
    {
      "title": string,
      "description": string,
      "is_boss": boolean,
      "tasks": [
        {
          "title": string,
          "estimated_hours": number
          "difficulty": "easy" | "medium" | "hard"
        }
      ]
    }
  ]
}

Rules:
- Output ONLY JSON
- Do not include markdown, explanations, or backticks
- Always include 5-8 milestones
- Each milestone must contain 3-7 tasks
- estimated_hours must be a number between 1 and 40
- is_boss must be boolean
- Distribute work realistically across the ${durationDays} day timeline
`;

    const roadmap = await generateRoadmapFromAI({
      systemPrompt,
      userPrompt: idea,
    });

    const parsed = parseRoadmapToDB(roadmap, project.id);
    const milestonesForDist = parsed.milestones.map((milestone) => ({
      id: milestone.id,
      orderindex: milestone.order_index,
      isboss: milestone.is_boss,
      tasks: parsed.tasks
        .filter((task) => task.milestoneid === milestone.id)
        .map((task) => ({
          id: task.id,
          milestoneid: task.milestoneid,
          orderindex: task.orderindex,
          estimated_hours: task.estimated_hours,
          difficulty: task.difficulty,
        })),
    }));
    const dueDates = distributeDueDates({
      milestones: milestonesForDist,
      startDate: new Date(),
      endDate: targetCompletionDate ? new Date(targetCompletionDate) : endDate,
    });
    const dueDateByTaskId = new Map(
      dueDates.map((item) => [item.taskid, item.duedate]),
    );
    const tasksForInsert = parsed.tasks.map((task) => ({
      id: task.id,
      milestone_id: task.milestoneid,
      title: task.title,
      completed: task.completed,
      order_index: task.orderindex,
      estimated_hours: task.estimated_hours ?? null,
      due_date: dueDateByTaskId.get(task.id) ?? task.due_date ?? null,
      difficulty: task.difficulty,
    }));

    const { error: phaseError } = await supabase
      .from("phases")
      .insert(parsed.phase);

    if (phaseError) {
      throw phaseError;
    }

    const { error: milestonesError } = await supabase
      .from("milestones")
      .insert(parsed.milestones);

    if (milestonesError) {
      throw milestonesError;
    }

    const { error: tasksError } = await supabase
      .from("tasks")
      .insert(tasksForInsert);

    if (tasksError) {
      throw tasksError;
    }

    await updateUsage({
      userId,
      wordsProcessed: validation.stats?.textWords ?? 0,
      documentsUploaded: 0,
    });

    return Response.json({
      success: true,
      data: {
        project_id: project.id,
        milestone_count: parsed.milestones.length,
        task_count: tasksForInsert.length,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
