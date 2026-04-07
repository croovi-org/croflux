import { createClient } from "@/lib/supabase/server";
import { ROADMAP_GENERATION_LIMIT } from "@/lib/onboarding/strategyLimits";

type UsageRow = {
  user_id: string;
  roadmaps_generated_count: number;
  total_words_processed: number;
  total_documents_uploaded: number;
  last_generation_date: string | null;
};

export type BetaUsage = {
  used: number;
  remaining: number;
  limit: number;
  totalWordsProcessed: number;
  totalDocumentsUploaded: number;
  lastGenerationDate: string | null;
};

export async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getOrCreateUsage(userId: string) {
  const supabase = await createClient();

  const { data: existing, error: lookupError } = await supabase
    .from("user_usage")
    .select(
      "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existing) {
    return toUsage(existing as UsageRow);
  }

  const { data: inserted, error: insertError } = await supabase
    .from("user_usage")
    .upsert({ user_id: userId })
    .select(
      "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date",
    )
    .maybeSingle();

  if (insertError || !inserted) {
    throw insertError ?? new Error("Unable to initialize usage");
  }

  return toUsage(inserted as UsageRow);
}

export async function incrementUsage(params: {
  userId: string;
  wordsProcessed?: number;
  documentsUploaded?: number;
}) {
  const supabase = await createClient();
  const current = await getOrCreateUsage(params.userId);

  if (current.used >= ROADMAP_GENERATION_LIMIT) {
    throw new Error("BETA_ROADMAP_LIMIT_REACHED");
  }

  const nextUsed = current.used + 1;
  const nextWords =
    current.totalWordsProcessed + Math.max(0, params.wordsProcessed ?? 0);
  const nextDocuments =
    current.totalDocumentsUploaded + Math.max(0, params.documentsUploaded ?? 0);

  const { data, error } = await supabase
    .from("user_usage")
    .update({
      roadmaps_generated_count: nextUsed,
      total_words_processed: nextWords,
      total_documents_uploaded: nextDocuments,
      last_generation_date: new Date().toISOString(),
    })
    .eq("user_id", params.userId)
    .lt("roadmaps_generated_count", ROADMAP_GENERATION_LIMIT)
    .select(
      "user_id, roadmaps_generated_count, total_words_processed, total_documents_uploaded, last_generation_date",
    )
    .maybeSingle();

  if (error || !data) {
    throw error ?? new Error("Unable to update usage");
  }

  return toUsage(data as UsageRow);
}

function toUsage(row: UsageRow): BetaUsage {
  const used = Math.max(0, row.roadmaps_generated_count ?? 0);
  return {
    used,
    remaining: Math.max(ROADMAP_GENERATION_LIMIT - used, 0),
    limit: ROADMAP_GENERATION_LIMIT,
    totalWordsProcessed: Math.max(0, row.total_words_processed ?? 0),
    totalDocumentsUploaded: Math.max(0, row.total_documents_uploaded ?? 0),
    lastGenerationDate: row.last_generation_date ?? null,
  };
}
