import { NextResponse } from "next/server";
import {
  NOTION_WORD_LIMIT,
  countWords,
  normalizePlainText,
  truncateToWordLimit,
} from "@/lib/onboarding/strategyLimits";

export const runtime = "nodejs";

type NotionExtractPayload = {
  notionUrl?: string;
};

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToPlainText(html: string) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as NotionExtractPayload | null;
  const notionUrl = body?.notionUrl?.trim();

  if (!notionUrl) {
    return NextResponse.json(
      { error: "Add a Notion link before continuing." },
      { status: 400 },
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(notionUrl);
  } catch {
    return NextResponse.json({ error: "Enter a valid Notion URL." }, { status: 400 });
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (!host.includes("notion")) {
    return NextResponse.json(
      { error: "Please use a public Notion URL." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "user-agent": "CroFluxBot/1.0 (+https://croflux.ai)",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Notion page");
    }

    const html = await response.text();
    const plain = normalizePlainText(htmlToPlainText(html));
    const truncated = truncateToWordLimit(plain, NOTION_WORD_LIMIT);
    const totalWordCount = countWords(plain);

    return NextResponse.json({
      text: truncated.text,
      totalWordCount,
      usedWordCount: truncated.usedWords,
      wasTruncated: truncated.truncated,
      warning: "We analyze the first 6000 words for roadmap generation",
    });
  } catch {
    return NextResponse.json(
      { error: "We could not fetch this Notion page. Make sure the page is public." },
      { status: 400 },
    );
  }
}
