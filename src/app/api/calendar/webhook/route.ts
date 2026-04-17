import { NextResponse } from "next/server";
import { ensureValidGoogleAccessToken, getSupabaseAdmin } from "@/lib/calendar/google";
import { getFullSyncToken, listIncrementalEvents } from "@/lib/calendar/googleEvents";
import { completeTask } from "@/lib/tasks/completeTask";

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();

  const channelId = request.headers.get("x-goog-channel-id");
  const resourceId = request.headers.get("x-goog-resource-id");
  const resourceState = request.headers.get("x-goog-resource-state");
  const channelToken = request.headers.get("x-goog-channel-token");

  if (!channelId) {
    return NextResponse.json({ success: true });
  }

  try {
    const { data: channelRow } = await supabaseAdmin
      .from("google_webhook_channels")
      .select("id, user_id, channel_id, resource_id, channel_token, sync_token")
      .eq("channel_id", channelId)
      .single();

    if (!channelRow) {
      return NextResponse.json({ success: true });
    }

    const validResource = resourceId && channelRow.resource_id === resourceId;
    const validToken = channelToken && channelRow.channel_token === channelToken;
    if (!validResource || !validToken) {
      return NextResponse.json({ success: true });
    }

    if (resourceState === "sync") {
      return NextResponse.json({ success: true });
    }

    const auth = await ensureValidGoogleAccessToken(channelRow.user_id, supabaseAdmin);
    if (!auth.connected || !auth.accessToken) {
      return NextResponse.json({ success: true });
    }

    if (!channelRow.sync_token) {
      const seedSyncToken = await getFullSyncToken(auth.accessToken);
      await supabaseAdmin
        .from("google_webhook_channels")
        .update({ sync_token: seedSyncToken })
        .eq("channel_id", channelId);
      return NextResponse.json({ success: true });
    }

    const syncResult = await listIncrementalEvents({
      accessToken: auth.accessToken,
      syncToken: channelRow.sync_token,
    });

    if (syncResult.needsResync) {
      const freshSyncToken = await getFullSyncToken(auth.accessToken);
      await supabaseAdmin
        .from("google_webhook_channels")
        .update({ sync_token: freshSyncToken })
        .eq("channel_id", channelId);
      return NextResponse.json({ success: true });
    }

    await supabaseAdmin
      .from("google_webhook_channels")
      .update({ sync_token: syncResult.nextSyncToken })
      .eq("channel_id", channelId);

    for (const event of syncResult.events) {
      try {
        if (!event.id) continue;
        if (event.status === "cancelled") continue;

        const privateProps = event.extendedProperties?.private ?? {};
        const completedInGoogle =
          privateProps.crofluxCompleted === "true" ||
          privateProps.crofluxStatus === "completed" ||
          (event.summary ?? "").trim().startsWith("[DONE]");

        if (!completedInGoogle) continue;

        const { data: taskRow } = await supabaseAdmin
          .from("tasks")
          .select("id, completed")
          .eq("google_event_id", event.id)
          .single();

        if (!taskRow || taskRow.completed) continue;

        await completeTask({
          userId: channelRow.user_id,
          taskId: taskRow.id,
        });
      } catch (eventError) {
        console.error("calendar webhook event processing failed:", eventError);
      }
    }
  } catch (error) {
    console.error("calendar webhook failed:", error);
  }

  return NextResponse.json({ success: true });
}
