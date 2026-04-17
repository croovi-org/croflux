import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/calendar/google";
import { pollGoogleTasksForUser } from "@/lib/calendar/googleTasksPolling";

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: users, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id")
      .not("google_calendar_token", "is", null)
      .not("google_tasklist_id", "is", null);

    if (usersError) {
      throw usersError;
    }

    for (const user of users ?? []) {
      try {
        await pollGoogleTasksForUser(String(user.id));
      } catch (error) {
        console.error("poll-all user processing failed:", {
          userId: user.id,
          error,
        });
      }
    }

    return NextResponse.json({
      success: true,
      usersPolled: (users ?? []).length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
