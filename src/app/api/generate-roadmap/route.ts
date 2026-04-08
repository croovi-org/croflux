import { createClient } from "@supabase/supabase-js";
import { generateRoadmapFromAI } from "@/lib/ai/aiClient";
import { parseRoadmapToDB } from "@/lib/ai/roadmapParser";

type GenerateRoadmapRequest = {
  name: string;
  idea: string;
  strategy?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateRoadmapRequest>;
    const name = body.name?.trim();
    const idea = body.idea?.trim();
    const strategy = body.strategy?.trim();

    if (!name || !idea) {
      return Response.json(
        { success: false, error: "name and idea are required" },
        { status: 400 },
      );
    }

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

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name,
        idea,
        strategy: strategy || null,
        product_stage: "mvp",
      })
      .select()
      .single();

    if (projectError || !project) {
      throw projectError ?? new Error("Failed to create project");
    }

    const roadmap = await generateRoadmapFromAI({
      systemPrompt: `
You are an expert startup execution planner.

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
          "description": string,
          "estimated_hours": number
        }
      ]
    }
  ]
}

Rules:
- Output ONLY JSON
- Do not include markdown
- Do not include explanations
- Do not include backticks
- Always include 5-8 milestones
- Each milestone must contain 3-7 tasks
- estimated_hours must be a number
- is_boss must be boolean
`,
      userPrompt: idea,
    });

    const parsed = parseRoadmapToDB(roadmap, project.id);

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
      .insert(parsed.tasks);

    if (tasksError) {
      throw tasksError;
    }

    return Response.json({
      success: true,
      project_id: project.id,
    });
  } catch (error) {
    console.error("=== GENERATE ROADMAP ERROR ===");
    console.error(error);
    console.error("==============================");

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
