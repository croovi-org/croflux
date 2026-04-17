import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ensureValidGoogleAccessToken,
  getSupabaseAdmin,
} from "@/lib/calendar/google";
import { getCompletedGoogleTasks } from "@/lib/googleTasks";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ synced: 0 }, { status: 200 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: userRow, error: userError } = await supabaseAdmin
      .from("users")
      .select("google_calendar_token, google_tasklist_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      throw userError;
    }

    if (!userRow?.google_calendar_token) {
      return NextResponse.json({ synced: 0 }, { status: 200 });
    }

    const tasklistId = userRow.google_tasklist_id as string | null;
    if (!tasklistId) {
      return NextResponse.json({ synced: 0 }, { status: 200 });
    }

    const auth = await ensureValidGoogleAccessToken(user.id, supabaseAdmin);
    if (!auth.connected || !auth.accessToken) {
      return NextResponse.json({ synced: 0 }, { status: 200 });
    }

    const completedGoogleTaskIds = await getCompletedGoogleTasks(
      auth.accessToken,
      tasklistId,
    );

    let synced = 0;

    for (const googleTaskId of completedGoogleTaskIds) {
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

      synced += 1;
    }

    return NextResponse.json({ synced }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
