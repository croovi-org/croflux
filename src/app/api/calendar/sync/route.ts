import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SyncBody = {
  userId: string;
  projectId: string;
};

type SyncResult = {
  synced: number;
  skipped?: string;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function refreshGoogleAccessToken(params: {
  refreshToken: string;
}): Promise<{ accessToken: string; expiresIn: number }> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: params.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token refresh failed: ${tokenRes.status}`);
  }

  const refreshed = (await tokenRes.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!refreshed.access_token || !refreshed.expires_in) {
    throw new Error("Google token refresh response missing fields");
  }

  return {
    accessToken: refreshed.access_token,
    expiresIn: refreshed.expires_in,
  };
}

export async function syncCalendarForProject({
  userId,
  projectId,
}: SyncBody): Promise<SyncResult> {
  const { data: userRow, error: userError } = await supabaseAdmin
    .from("users")
    .select(
      "google_calendar_token, google_calendar_refresh_token, google_calendar_token_expiry, google_calendar_connected",
    )
    .eq("id", userId)
    .single();

  if (userError) {
    throw userError;
  }

  if (!userRow?.google_calendar_connected) {
    return { synced: 0, skipped: "not connected" };
  }

  let accessToken = userRow.google_calendar_token as string | null;
  const refreshToken = userRow.google_calendar_refresh_token as string | null;
  const expiry = userRow.google_calendar_token_expiry as string | null;

  const expired = !expiry || new Date(expiry).getTime() <= Date.now();

  if (expired) {
    if (!refreshToken) {
      return { synced: 0, skipped: "missing refresh token" };
    }

    const refreshed = await refreshGoogleAccessToken({ refreshToken });
    accessToken = refreshed.accessToken;

    const { error: updateTokenError } = await supabaseAdmin
      .from("users")
      .update({
        google_calendar_token: refreshed.accessToken,
        google_calendar_token_expiry: new Date(
          Date.now() + refreshed.expiresIn * 1000,
        ).toISOString(),
      })
      .eq("id", userId);

    if (updateTokenError) {
      throw updateTokenError;
    }
  }

  if (!accessToken) {
    return { synced: 0, skipped: "missing access token" };
  }

  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from("tasks")
    .select(
      "id, title, due_date, milestone_id, milestones!inner(title, project_id)",
    )
    .eq("milestones.project_id", projectId)
    .not("due_date", "is", null);

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

    const eventRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: task.title,
          description: `Milestone: ${milestoneTitle} | CroFlux task`,
          start: { date: task.due_date },
          end: { date: task.due_date },
        }),
      },
    );

    if (!eventRes.ok) {
      continue;
    }

    const event = (await eventRes.json()) as { id?: string };
    if (!event.id) {
      continue;
    }

    const { error: updateTaskError } = await supabaseAdmin
      .from("tasks")
      .update({ google_event_id: event.id })
      .eq("id", task.id);

    if (updateTaskError) {
      continue;
    }

    synced += 1;
  }

  return { synced };
}

export async function POST(request: Request) {
  try {
    const { userId, projectId } = (await request.json()) as Partial<SyncBody>;

    if (!userId || !projectId) {
      return NextResponse.json(
        { error: "userId and projectId are required" },
        { status: 400 },
      );
    }

    const result = await syncCalendarForProject({ userId, projectId });
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
