import "server-only";

import { createClient } from "@/lib/supabase/server";

const MAX_ROADMAPS = 5;

type UsageRow = {
  user_id: string;
  roadmaps_generated_count: number | null;
  total_words_processed: number | null;
  total_documents_uploaded: number | null;
};

type UsageSummary = {
  roadmapsGenerated: number;
  totalWordsProcessed: number;
  totalDocumentsUploaded: number;
};

export type CheckUsageResult = {
  canGenerate: boolean;
  remaining: number;
  usage: UsageSummary;
};

export async function checkUsage(userId: string): Promise<CheckUsageResult> {
  try {
    const supabase = await createClient();

    const { data: existing, error: lookupError } = await supabase
      .from("user_usage")
      .select(
        "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded",
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      const { data: inserted, error: insertError } = await supabase
        .from("user_usage")
        .insert({
          user_id: userId,
          roadmaps_generated_count: 0,
          total_words_processed: 0,
          total_documents_uploaded: 0,
        })
        .select(
          "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded",
        )
        .maybeSingle();

      if (insertError || !inserted) {
        throw insertError ?? new Error("Unable to initialize user usage.");
      }

      return {
        canGenerate: true,
        remaining: MAX_ROADMAPS,
        usage: toUsageSummary(inserted as UsageRow),
      };
    }

    const usage = toUsageSummary(existing as UsageRow);
    const remaining = Math.max(MAX_ROADMAPS - usage.roadmapsGenerated, 0);

    return {
      canGenerate: remaining > 0,
      remaining,
      usage,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to check user usage.";
    throw new Error(`checkUsage failed: ${message}`);
  }
}

function toUsageSummary(row: UsageRow): UsageSummary {
  return {
    roadmapsGenerated: Math.max(0, row.roadmaps_generated_count ?? 0),
    totalWordsProcessed: Math.max(0, row.total_words_processed ?? 0),
    totalDocumentsUploaded: Math.max(0, row.total_documents_uploaded ?? 0),
  };
}
