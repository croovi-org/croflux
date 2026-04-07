import { NextResponse } from "next/server";
import { getCurrentUserId, getOrCreateUsage, incrementUsage } from "@/lib/onboarding/userUsage";

export const runtime = "nodejs";

type IncrementBody = {
  wordsProcessed?: number;
  documentsUploaded?: number;
};

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await getOrCreateUsage(userId);
    return NextResponse.json(usage);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch beta usage right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as IncrementBody | null;
  const wordsProcessed = Math.max(0, Math.floor(body?.wordsProcessed ?? 0));
  const documentsUploaded = Math.max(0, Math.floor(body?.documentsUploaded ?? 0));

  try {
    const usage = await incrementUsage({
      userId,
      wordsProcessed,
      documentsUploaded,
    });
    return NextResponse.json(usage);
  } catch (error) {
    if (error instanceof Error && error.message === "BETA_ROADMAP_LIMIT_REACHED") {
      return NextResponse.json(
        { error: "Beta roadmap limit reached." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unable to update beta usage right now." },
      { status: 500 },
    );
  }
}
