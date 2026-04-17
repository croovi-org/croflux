import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ensureValidGoogleAccessToken,
  getSupabaseAdmin,
} from "@/lib/calendar/google";
import { distributeDueDates } from "@/lib/scheduling/distributor";

type RescheduleBody = {
  projectId: string;
  newTargetDate: string;
};

type TaskRow = {
  id: string;
  milestone_id: string;
  due_date: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  estimated_hours: number | null;
  order_index: number | null;
  google_task_id: string | null;
  google_tasklist_id: string | null;
  milestones:
    | {
        id: string;
        order_index: number;
      }
    | {
        id: string;
        order_index: number;
      }[]
    | null;
};

function toGoogleDueDate(date: string): string {
  return `${date}T00:00:00.000Z`;
}

function normalizeDifficulty(
  value: string | null,
): "easy" | "medium" | "hard" {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }
  return "medium";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RescheduleBody>;
    const projectId = body.projectId;
    const newTargetDate = body.newTargetDate;

    if (!projectId || !newTargetDate) {
      return NextResponse.json(
        { error: "projectId and newTargetDate are required" },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newTargetDate)) {
      return NextResponse.json(
        { error: "newTargetDate must be in YYYY-MM-DD format" },
        { status: 400 },
      );
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

    const { data: projectRow, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id, user_id, start_date")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !projectRow) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { error: updateProjectError } = await supabaseAdmin
      .from("projects")
      .update({ target_completion_date: newTargetDate })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (updateProjectError) {
      throw updateProjectError;
    }

    const { data: taskRowsRaw, error: tasksError } = await supabaseAdmin
      .from("tasks")
      .select(
        "id, milestone_id, due_date, difficulty, estimated_hours, completed, order_index, google_task_id, google_tasklist_id, milestones!inner(id, project_id, order_index)",
      )
      .eq("milestones.project_id", projectId)
      .eq("completed", false);

    if (tasksError) {
      throw tasksError;
    }

    const taskRows = (taskRowsRaw ?? []) as TaskRow[];

    const orderedTasks = [...taskRows].sort((left, right) => {
      const leftMilestone = Array.isArray(left.milestones)
        ? left.milestones[0]
        : left.milestones;
      const rightMilestone = Array.isArray(right.milestones)
        ? right.milestones[0]
        : right.milestones;

      const leftMilestoneOrder = leftMilestone?.order_index ?? 0;
      const rightMilestoneOrder = rightMilestone?.order_index ?? 0;

      if (leftMilestoneOrder !== rightMilestoneOrder) {
        return leftMilestoneOrder - rightMilestoneOrder;
      }

      const leftTaskOrder = left.order_index ?? 0;
      const rightTaskOrder = right.order_index ?? 0;
      return leftTaskOrder - rightTaskOrder;
    });

    if (orderedTasks.length === 0) {
      return NextResponse.json({ success: true, rescheduled: 0 });
    }

    const startDateValue = projectRow.start_date
      ? new Date(projectRow.start_date)
      : new Date();
    const endDateValue = new Date(newTargetDate);

    const milestoneMap = new Map<
      string,
      {
        id: string;
        orderindex: number;
        isboss: boolean;
        tasks: Array<{
          id: string;
          milestoneid: string;
          orderindex: number;
          estimated_hours?: number;
          difficulty: "easy" | "medium" | "hard";
        }>;
      }
    >();

    for (const task of orderedTasks) {
      const milestone = Array.isArray(task.milestones)
        ? task.milestones[0]
        : task.milestones;
      if (!milestone) continue;

      if (!milestoneMap.has(milestone.id)) {
        milestoneMap.set(milestone.id, {
          id: milestone.id,
          orderindex: milestone.order_index ?? 0,
          isboss: false,
          tasks: [],
        });
      }

      milestoneMap.get(milestone.id)?.tasks.push({
        id: task.id,
        milestoneid: task.milestone_id,
        orderindex: task.order_index ?? 0,
        estimated_hours: task.estimated_hours ?? undefined,
        difficulty: normalizeDifficulty(task.difficulty),
      });
    }

    const dueDates = distributeDueDates({
      milestones: Array.from(milestoneMap.values()),
      startDate: startDateValue,
      endDate: endDateValue,
    });

    const dueDateByTaskId = new Map(dueDates.map((item) => [item.taskid, item.duedate]));

    let rescheduled = 0;

    for (const task of orderedTasks) {
      const nextDueDate = dueDateByTaskId.get(task.id);
      if (!nextDueDate) {
        continue;
      }

      const { error: updateTaskError } = await supabaseAdmin
        .from("tasks")
        .update({ due_date: nextDueDate })
        .eq("id", task.id);

      if (updateTaskError) {
        throw updateTaskError;
      }

      rescheduled += 1;
    }

    const auth = await ensureValidGoogleAccessToken(user.id, supabaseAdmin);

    if (auth.connected && auth.accessToken) {
      for (const task of orderedTasks) {
        const googleTaskId = task.google_task_id;
        const googleTasklistId = task.google_tasklist_id;
        const dueDate = dueDateByTaskId.get(task.id);

        if (!googleTaskId || !googleTasklistId || !dueDate) {
          continue;
        }

        try {
          const googleResponse = await fetch(
            `https://tasks.googleapis.com/tasks/v1/lists/${googleTasklistId}/tasks/${googleTaskId}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                due: toGoogleDueDate(dueDate),
              }),
            },
          );

          if (!googleResponse.ok) {
            throw new Error(
              `Google Tasks patch failed (${googleResponse.status})`,
            );
          }
        } catch (googleError) {
          console.error("Google task due-date patch failed:", {
            taskId: task.id,
            googleTaskId,
            error: googleError,
          });
        }
      }
    }

    return NextResponse.json({ success: true, rescheduled });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
