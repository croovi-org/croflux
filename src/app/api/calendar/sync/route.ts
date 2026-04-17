import { NextResponse } from "next/server";
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google";
import { getOrCreateCroFluxTasklist, getTasksClient } from "@/lib/googleTasks";

type SyncBody = {
  userId: string;
};

type SyncResult = {
  success: true;
  synced: number;
  skipped?: string;
};

export async function syncGoogleTasksForUser({
  userId,
}: SyncBody): Promise<SyncResult> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: userRow, error: userError } = await supabaseAdmin
    .from("users")
    .select(
      "google_calendar_token, google_calendar_refresh_token, google_calendar_token_expiry, google_tasklist_id, google_calendar_connected",
    )
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  if (!userRow?.google_calendar_connected) {
    return { success: true, synced: 0, skipped: "not connected" };
  }

  const auth = await ensureValidGoogleAccessToken(userId, supabaseAdmin);
  if (!auth.connected || !auth.accessToken) {
    return { success: true, synced: 0, skipped: "missing access token" };
  }

  const tasksClient = getTasksClient(auth.accessToken);
  const tasklistId = await getOrCreateCroFluxTasklist(auth.accessToken, userId);

  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from("tasks")
    .select(
      "id, title, due_date, google_task_id, milestones!inner(title, projects!inner(user_id))",
    )
    .eq("milestones.projects.user_id", userId)
    .is("google_task_id", null);

  if (tasksError) {
    throw tasksError;
  }

  let synced = 0;

  for (const task of tasks ?? []) {
    const milestone = Array.isArray(task.milestones)
      ? task.milestones[0]
      : task.milestones;
    const milestoneTitle =
      (milestone as { title?: string | null } | null)?.title ?? "Milestone";

    try {
      const requestBody: { title: string; notes: string; due?: string } = {
        title: String(task.title ?? "Untitled task"),
        notes: `Milestone: ${milestoneTitle} | CroFlux task`,
      };

      if (task.due_date) {
        requestBody.due = new Date(String(task.due_date)).toISOString();
      }

      const createResponse = await tasksClient.tasks.insert({
        tasklist: tasklistId,
        requestBody,
      });

      const googleTaskId = createResponse.data.id;
      if (!googleTaskId) {
        continue;
      }

      const { error: updateTaskError } = await supabaseAdmin
        .from("tasks")
        .update({
          google_task_id: googleTaskId,
          google_tasklist_id: tasklistId,
        })
        .eq("id", task.id);

      if (updateTaskError) {
        continue;
      }

      synced += 1;
    } catch (error) {
      console.error("Google Tasks sync item failed:", error);
    }
  }

  return { success: true, synced };
}

export async function POST(request: Request) {
  try {
    const { userId } = (await request.json()) as Partial<SyncBody>;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const result = await syncGoogleTasksForUser({ userId });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
