import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google";
import { getCompletedGoogleTasks } from "@/lib/googleTasks";
import { completeTask } from "@/lib/tasks/completeTask";

export async function pollGoogleTasksForUser(userId: string): Promise<{
  newlyCompleted: number;
  skipped?: string;
}> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: userRow, error: userError } = await supabaseAdmin
    .from("users")
    .select("google_tasklist_id")
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  const tasklistId = userRow?.google_tasklist_id as string | null;

  if (!tasklistId) {
    return { newlyCompleted: 0, skipped: "missing tasklist" };
  }

  const auth = await ensureValidGoogleAccessToken(userId, supabaseAdmin);
  if (!auth.connected || !auth.accessToken) {
    return { newlyCompleted: 0, skipped: "not connected" };
  }

  const completedGoogleTaskIds = await getCompletedGoogleTasks(
    auth.accessToken,
    tasklistId,
  );

  let newlyCompleted = 0;

  for (const googleTaskId of completedGoogleTaskIds) {
    try {
      const { data: taskRow, error: taskError } = await supabaseAdmin
        .from("tasks")
        .select("id, completed")
        .eq("google_task_id", googleTaskId)
        .maybeSingle();

      if (taskError) {
        throw taskError;
      }

      if (!taskRow || taskRow.completed) {
        continue;
      }

      const result = await completeTask({
        userId,
        taskId: taskRow.id,
      });

      if (!result.alreadyCompleted) {
        newlyCompleted += 1;
      }
    } catch (error) {
      console.error("Google Tasks poll item processing failed:", error);
    }
  }

  return { newlyCompleted };
}
