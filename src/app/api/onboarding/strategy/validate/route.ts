import { NextResponse } from "next/server";
import {
  FILE_WORD_LIMIT,
  NOTION_WORD_LIMIT,
  STRATEGY_TEXT_WORD_LIMIT,
} from "@/lib/onboarding/strategyLimits";
import { getCurrentUserId, getOrCreateUsage } from "@/lib/onboarding/userUsage";

export const runtime = "nodejs";

type ValidateBody = {
  strategyMode?: "paste" | "upload" | "notion";
  textInputWords?: number;
  fileWords?: number;
  notionWords?: number;
};

export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as ValidateBody | null;
  const strategyMode = body?.strategyMode;
  const textInputWords = Math.max(0, Math.floor(body?.textInputWords ?? 0));
  const fileWords = Math.max(0, Math.floor(body?.fileWords ?? 0));
  const notionWords = Math.max(0, Math.floor(body?.notionWords ?? 0));

  if (!strategyMode) {
    return NextResponse.json(
      { error: "Strategy mode is required." },
      { status: 400 },
    );
  }

  if (textInputWords > STRATEGY_TEXT_WORD_LIMIT) {
    return NextResponse.json(
      { error: "Strategy too long. Please keep within 1200 words for best results." },
      { status: 400 },
    );
  }

  if (fileWords > FILE_WORD_LIMIT) {
    return NextResponse.json(
      { error: "Only first 10 pages will be used to generate roadmap." },
      { status: 400 },
    );
  }

  if (notionWords > NOTION_WORD_LIMIT) {
    return NextResponse.json(
      { error: "We analyze the first 6000 words for roadmap generation." },
      { status: 400 },
    );
  }

  try {
    const usage = await getOrCreateUsage(userId);

    if (usage.remaining <= 0) {
      return NextResponse.json(
        { error: "Beta roadmap limit reached." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      remainingGenerations: usage.remaining,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to validate strategy right now." },
      { status: 500 },
    );
  }
}
