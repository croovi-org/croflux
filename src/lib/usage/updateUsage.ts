import "server-only";

import { createClient } from "@/lib/supabase/server";

type UsageRow = {
  user_id: string;
  roadmaps_generated_count: number | null;
  total_words_processed: number | null;
  total_documents_uploaded: number | null;
  last_generation_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UpdateUsageParams = {
  userId: string;
  wordsProcessed: number;
  documentsUploaded: number;
};

export type UpdatedUsage = {
  userId: string;
  roadmapsGeneratedCount: number;
  totalWordsProcessed: number;
  totalDocumentsUploaded: number;
  lastGenerationDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function updateUsage(
  params: UpdateUsageParams,
): Promise<UpdatedUsage> {
  try {
    const supabase = await createClient();
    const wordsIncrement = Math.max(0, Math.round(params.wordsProcessed));
    const docsIncrement = Math.max(0, Math.round(params.documentsUploaded));

    const { data: existing, error: lookupError } = await supabase
      .from("user_usage")
      .select(
        "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date, created_at, updated_at",
      )
      .eq("user_id", params.userId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    let baseRow = existing as UsageRow | null;

    if (!baseRow) {
      const { data: inserted, error: insertError } = await supabase
        .from("user_usage")
        .insert({
          user_id: params.userId,
          roadmaps_generated_count: 0,
          total_words_processed: 0,
          total_documents_uploaded: 0,
        })
        .select(
          "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date, created_at, updated_at",
        )
        .maybeSingle();

      if (insertError || !inserted) {
        throw insertError ?? new Error("Unable to initialize user usage.");
      }

      baseRow = inserted as UsageRow;
    }

    const nextRoadmaps = Math.max(0, baseRow.roadmaps_generated_count ?? 0) + 1;
    const nextWords =
      Math.max(0, baseRow.total_words_processed ?? 0) + wordsIncrement;
    const nextDocuments =
      Math.max(0, baseRow.total_documents_uploaded ?? 0) + docsIncrement;
    const nowIso = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from("user_usage")
      .update({
        roadmaps_generated_count: nextRoadmaps,
        total_words_processed: nextWords,
        total_documents_uploaded: nextDocuments,
        last_generation_date: nowIso,
        updated_at: nowIso,
      })
      .eq("user_id", params.userId)
      .select(
        "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date, created_at, updated_at",
      )
      .maybeSingle();

    if (updateError || !updated) {
      throw updateError ?? new Error("Unable to update user usage.");
    }

    const row = updated as UsageRow;

    return {
      userId: row.user_id,
      roadmapsGeneratedCount: Math.max(0, row.roadmaps_generated_count ?? 0),
      totalWordsProcessed: Math.max(0, row.total_words_processed ?? 0),
      totalDocumentsUploaded: Math.max(0, row.total_documents_uploaded ?? 0),
      lastGenerationDate: row.last_generation_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user usage.";
    throw new Error(`updateUsage failed: ${message}`);
  }
}
