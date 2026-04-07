import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { NextResponse } from "next/server";
import {
  FILE_PAGE_LIMIT,
  FILE_SIZE_LIMIT_BYTES,
  FILE_WORD_LIMIT,
  countWords,
  estimatePages,
  normalizePlainText,
  truncateToWordLimit,
} from "@/lib/onboarding/strategyLimits";

export const runtime = "nodejs";

const SUPPORTED_EXTENSIONS = new Set(["pdf", "docx", "txt"]);

function getExtension(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();
  return ext ?? "";
}

async function extractText(file: File, extension: string) {
  if (extension === "txt") {
    return file.text();
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (extension === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  return "";
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a file first." }, { status: 400 });
  }

  if (file.size > FILE_SIZE_LIMIT_BYTES) {
    return NextResponse.json({ error: "File must be 5MB or smaller." }, { status: 400 });
  }

  const extension = getExtension(file.name);
  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { error: "Only PDF, DOCX, or TXT files are supported in beta." },
      { status: 400 },
    );
  }

  try {
    const extracted = await extractText(file, extension);
    const normalized = normalizePlainText(extracted);
    const totalWords = countWords(normalized);
    const estimatedPages = estimatePages(totalWords);
    const truncated = truncateToWordLimit(normalized, FILE_WORD_LIMIT);
    const overLimit = totalWords > FILE_WORD_LIMIT || estimatedPages > FILE_PAGE_LIMIT;

    return NextResponse.json({
      text: overLimit ? truncated.text : normalized,
      totalWordCount: totalWords,
      usedWordCount: overLimit ? truncated.usedWords : totalWords,
      estimatedPageCount: estimatedPages,
      wasTruncated: overLimit,
      warning: overLimit
        ? "Only first 10 pages will be used to generate roadmap"
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "We could not process this file. Try PDF, DOCX, or TXT." },
      { status: 400 },
    );
  }
}
