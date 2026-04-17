import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google";
import { getFullSyncToken } from "@/lib/calendar/googleEvents";

type WatchBody = { userId: string };

export async function registerCalendarWatch(params: WatchBody) {
  const supabaseAdmin = getSupabaseAdmin();
  const auth = await ensureValidGoogleAccessToken(params.userId, supabaseAdmin);

  if (!auth.connected || !auth.accessToken) {
    return { success: true, channelId: null, skipped: "not connected" as const };
  }

  const channelId = randomUUID();
  const channelToken = randomUUID();
  const expirationMillis = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const webhookAddress = `${process.env.NEXT_PUBLIC_APP_URL}/api/calendar/webhook`;

  const watchResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events/watch",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: channelId,
        type: "web_hook",
        address: webhookAddress,
        token: channelToken,
        expiration: String(expirationMillis),
      }),
    },
  );

  if (!watchResponse.ok) {
    throw new Error(`Google watch setup failed (${watchResponse.status})`);
  }

  const watchData = (await watchResponse.json()) as {
    resourceId?: string;
    expiration?: string;
  };

  if (!watchData.resourceId) {
    throw new Error("Google watch setup missing resourceId");
  }

  await supabaseAdmin
    .from("google_webhook_channels")
    .delete()
    .eq("user_id", params.userId);

  const expirationIso = watchData.expiration
    ? new Date(Number(watchData.expiration)).toISOString()
    : new Date(expirationMillis).toISOString();

  const { error: insertError } = await supabaseAdmin
    .from("google_webhook_channels")
    .insert({
      user_id: params.userId,
      channel_id: channelId,
      resource_id: watchData.resourceId,
      channel_token: channelToken,
      expiration: expirationIso,
    });

  if (insertError) {
    throw insertError;
  }

  const nextSyncToken = await getFullSyncToken(auth.accessToken);
  const { error: updateError } = await supabaseAdmin
    .from("google_webhook_channels")
    .update({ sync_token: nextSyncToken })
    .eq("channel_id", channelId);

  if (updateError) {
    throw updateError;
  }

  return { success: true, channelId };
}

export async function POST(request: Request) {
  try {
    const { userId } = (await request.json()) as Partial<WatchBody>;
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const result = await registerCalendarWatch({ userId });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
