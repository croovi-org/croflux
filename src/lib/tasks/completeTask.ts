import { getSupabaseAdmin } from "@/lib/calendar/google";

type CompleteTaskParams = {
  userId: string;
  taskId: string;
};

type CompleteTaskResult = {
  success: true;
  alreadyCompleted: boolean;
  task: {
    id: string;
    title: string;
    projectId: string | null;
    googleTaskId: string | null;
    googleTasklistId: string | null;
  };
};

export async function completeTask(
  params: CompleteTaskParams,
): Promise<CompleteTaskResult> {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: taskRow, error: taskError } = await supabaseAdmin
    .from("tasks")
    .select("id, title, completed, milestone_id, google_task_id, google_tasklist_id")
    .eq("id", params.taskId)
    .single();

  if (taskError || !taskRow) {
    throw taskError ?? new Error("Task not found");
  }

  const { data: milestoneRow, error: milestoneError } = await supabaseAdmin
    .from("milestones")
    .select("project_id")
    .eq("id", taskRow.milestone_id)
    .single();

  if (milestoneError) {
    throw milestoneError;
  }

  const projectId = milestoneRow?.project_id ?? null;

  if (projectId) {
    const { data: projectRow, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    if (projectError) {
      throw projectError;
    }

    if (projectRow?.user_id !== params.userId) {
      throw new Error("Unauthorized");
    }
  }

  if (!taskRow.completed) {
    const { error: updateError } = await supabaseAdmin
      .from("tasks")
      .update({
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskRow.id);

    if (updateError) {
      throw updateError;
    }
  }

  if (!taskRow.completed) {
    try {
      const { error: nextSchemaError } = await supabaseAdmin
        .from("activity_log")
        .insert({
          user_id: params.userId,
          project_id: projectId,
          action: "task_completed",
          metadata: {
            taskId: taskRow.id,
            title: taskRow.title,
          },
          timestamp: new Date().toISOString(),
        });

      if (nextSchemaError) {
        await supabaseAdmin.from("activity_log").insert({
          user_id: params.userId,
          task_completed: true,
          project_id: projectId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("activity_log insert failed:", error);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: recentActivity } = await supabaseAdmin
      .from("activity_log")
      .select("timestamp")
      .eq("user_id", params.userId)
      .gte(
        "timestamp",
        new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("timestamp", { ascending: false });

    const activeDays = new Set(
      (recentActivity ?? []).map((entry) => {
        const day = new Date(entry.timestamp);
        day.setHours(0, 0, 0, 0);
        return day.getTime();
      }),
    );

    let streak = 0;
    const probe = new Date(today);
    while (activeDays.has(probe.getTime())) {
      streak += 1;
      probe.setDate(probe.getDate() - 1);
    }

    const { data: currentUser } = await supabaseAdmin
      .from("users")
      .select("weekly_tasks_completed")
      .eq("id", params.userId)
      .single();

    const nextWeekly = (currentUser?.weekly_tasks_completed ?? 0) + 1;
    const nowIso = new Date().toISOString();

    const { error: newSchemaUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        current_streak: streak,
        last_activity_date: nowIso,
        weekly_tasks_completed: nextWeekly,
        streak,
      })
      .eq("id", params.userId);

    if (newSchemaUpdateError) {
      await supabaseAdmin
        .from("users")
        .update({
          streak,
          weekly_tasks_completed: nextWeekly,
        })
        .eq("id", params.userId);
    }
  }

  return {
    success: true,
    alreadyCompleted: Boolean(taskRow.completed),
    task: {
      id: taskRow.id,
      title: taskRow.title,
      projectId,
      googleTaskId: taskRow.google_task_id ?? null,
      googleTasklistId: taskRow.google_tasklist_id ?? null,
    },
  };
}
