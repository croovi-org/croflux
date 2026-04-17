import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google";
import { deleteGoogleTask } from "@/lib/googleTasks";

export async function POST(request: Request) {
  try {
    const { taskId } = (await request.json()) as { taskId?: string };
    if (!taskId) {
      return NextResponse.json({ error: "taskId required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: taskRow, error: taskError } = await supabaseAdmin
      .from("tasks")
      .select("id, title, milestone_id, google_task_id, google_tasklist_id")
      .eq("id", taskId)
      .single();

    if (taskError || !taskRow) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { data: milestoneRow, error: milestoneError } = await supabaseAdmin
      .from("milestones")
      .select("project_id")
      .eq("id", taskRow.milestone_id)
      .single();

    if (milestoneError || !milestoneRow?.project_id) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    const { data: projectRow, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("user_id")
      .eq("id", milestoneRow.project_id)
      .single();

    if (projectError || !projectRow) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (projectRow.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const googleTaskId = taskRow.google_task_id as string | null;
    const googleTasklistId = taskRow.google_tasklist_id as string | null;

    if (googleTaskId && googleTasklistId) {
      try {
        const auth = await ensureValidGoogleAccessToken(user.id, supabaseAdmin);
        if (auth.connected && auth.accessToken) {
          await deleteGoogleTask(auth.accessToken, googleTasklistId, googleTaskId);
        }
      } catch (error) {
        console.error("Google task delete failed:", error);
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
