import { NextResponse } from "next/server";
import { pollGoogleTasksForUser } from "@/lib/calendar/googleTasksPolling";

type PollBody = {
  userId: string;
};

export async function POST(request: Request) {
  try {
    const { userId } = (await request.json()) as Partial<PollBody>;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const result = await pollGoogleTasksForUser(userId);

    return NextResponse.json({
      success: true,
      newlyCompleted: result.newlyCompleted,
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
