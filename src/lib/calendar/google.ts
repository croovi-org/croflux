import { createClient } from "@supabase/supabase-js";

type CalendarUserRow = {
  google_calendar_token: string | null;
  google_calendar_refresh_token: string | null;
  google_calendar_token_expiry: string | null;
  google_calendar_connected: boolean | null;
};

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token refresh failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token || !data.expires_in) {
    throw new Error("Google token refresh response missing fields");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

export async function getUserCalendarAuth(
  userId: string,
  supabaseAdmin = getSupabaseAdmin(),
) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(
      "google_calendar_token, google_calendar_refresh_token, google_calendar_token_expiry, google_calendar_connected",
    )
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data as CalendarUserRow | null;
}

export async function ensureValidGoogleAccessToken(
  userId: string,
  supabaseAdmin = getSupabaseAdmin(),
) {
  const user = await getUserCalendarAuth(userId, supabaseAdmin);

  if (!user?.google_calendar_connected) {
    return { connected: false as const, accessToken: null };
  }

  const expiryMs = user.google_calendar_token_expiry
    ? new Date(user.google_calendar_token_expiry).getTime()
    : 0;
  const isExpired = !expiryMs || expiryMs <= Date.now();

  if (!isExpired && user.google_calendar_token) {
    return { connected: true as const, accessToken: user.google_calendar_token };
  }

  if (!user.google_calendar_refresh_token) {
    return { connected: true as const, accessToken: null };
  }

  const refreshed = await refreshGoogleAccessToken(
    user.google_calendar_refresh_token,
  );

  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      google_calendar_token: refreshed.accessToken,
      google_calendar_token_expiry: new Date(
        Date.now() + refreshed.expiresIn * 1000,
      ).toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    throw updateError;
  }

  return { connected: true as const, accessToken: refreshed.accessToken };
}

export async function markGoogleEventCompleted(params: {
  userId: string;
  eventId: string;
  taskTitle: string;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  const auth = await ensureValidGoogleAccessToken(params.userId, supabaseAdmin);
  if (!auth.connected || !auth.accessToken) return;

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${params.eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `[COMPLETED] ${params.taskTitle}`,
        colorId: "11",
        extendedProperties: {
          private: {
            crofluxCompleted: "true",
            crofluxStatus: "completed",
          },
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to patch Google event (${response.status})`);
  }
}

export async function deleteGoogleEvent(params: {
  userId: string;
  eventId: string;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  const auth = await ensureValidGoogleAccessToken(params.userId, supabaseAdmin);
  if (!auth.connected || !auth.accessToken) return;

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${params.eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    },
  );

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete Google event (${response.status})`);
  }
}
