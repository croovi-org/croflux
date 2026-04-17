import { google } from "googleapis";
import { getSupabaseAdmin } from "@/lib/calendar/google";

export function getTasksClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.tasks({
    version: "v1",
    auth,
  });
}

export async function getOrCreateCroFluxTasklist(
  accessToken: string,
  userId: string,
): Promise<string> {
  const tasksClient = getTasksClient(accessToken);
  const supabaseAdmin = getSupabaseAdmin();

  try {
    const tasklistsResponse = await tasksClient.tasklists.list();
    const existing = (tasklistsResponse.data.items ?? []).find(
      (item) => item.title === "CroFlux" && item.id,
    );

    const tasklistId =
      existing?.id ??
      (
        await tasksClient.tasklists.insert({
          requestBody: { title: "CroFlux" },
        })
      ).data.id;

    if (!tasklistId) {
      throw new Error("Failed to resolve CroFlux Google Tasklist ID");
    }

    const { error: updateUserError } = await supabaseAdmin
      .from("users")
      .update({ google_tasklist_id: tasklistId })
      .eq("id", userId);

    if (updateUserError) {
      throw updateUserError;
    }

    return tasklistId;
  } catch (error) {
    console.error("getOrCreateCroFluxTasklist failed:", error);
    throw error;
  }
}

export async function createGoogleTask(
  accessToken: string,
  tasklistId: string,
  task: { id: string; title: string; due: string; notes: string },
): Promise<string> {
  const tasksClient = getTasksClient(accessToken);
  const supabaseAdmin = getSupabaseAdmin();

  try {
    const createResponse = await tasksClient.tasks.insert({
      tasklist: tasklistId,
      requestBody: {
        title: task.title,
        due: task.due,
        notes: task.notes,
      },
    });

    const googleTaskId = createResponse.data.id;

    if (!googleTaskId) {
      throw new Error("Google Tasks create response missing task ID");
    }

    const { error: updateTaskError } = await supabaseAdmin
      .from("tasks")
      .update({
        google_task_id: googleTaskId,
        google_tasklist_id: tasklistId,
      })
      .eq("id", task.id);

    if (updateTaskError) {
      throw updateTaskError;
    }

    return googleTaskId;
  } catch (error) {
    console.error("createGoogleTask failed:", error);
    throw error;
  }
}

export async function completeGoogleTask(
  accessToken: string,
  tasklistId: string,
  googleTaskId: string,
): Promise<void> {
  const tasksClient = getTasksClient(accessToken);

  try {
    await tasksClient.tasks.patch({
      tasklist: tasklistId,
      task: googleTaskId,
      requestBody: {
        status: "completed",
      },
    });
  } catch (error) {
    console.error("completeGoogleTask failed:", error);
    throw error;
  }
}

export async function deleteGoogleTask(
  accessToken: string,
  tasklistId: string,
  googleTaskId: string,
): Promise<void> {
  const tasksClient = getTasksClient(accessToken);

  try {
    await tasksClient.tasks.delete({
      tasklist: tasklistId,
      task: googleTaskId,
    });
  } catch (error) {
    console.error("deleteGoogleTask failed:", error);
    throw error;
  }
}

export async function getCompletedGoogleTasks(
  accessToken: string,
  tasklistId: string,
): Promise<string[]> {
  const tasksClient = getTasksClient(accessToken);

  try {
    const completedIds: string[] = [];
    let pageToken: string | undefined;

    do {
      const response = await tasksClient.tasks.list({
        tasklist: tasklistId,
        showCompleted: true,
        showHidden: true,
        pageToken,
      });

      const items = response.data.items ?? [];
      for (const item of items) {
        if (item.status === "completed" && item.id) {
          completedIds.push(item.id);
        }
      }

      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);

    return completedIds;
  } catch (error) {
    console.error("getCompletedGoogleTasks failed:", error);
    throw error;
  }
}
