CREATE TABLE IF NOT EXISTS user_usage (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  roadmaps_generated_count INTEGER NOT NULL DEFAULT 0 CHECK (roadmaps_generated_count >= 0),
  last_generation_date TIMESTAMPTZ,
  total_words_processed INTEGER NOT NULL DEFAULT 0 CHECK (total_words_processed >= 0),
  total_documents_uploaded INTEGER NOT NULL DEFAULT 0 CHECK (total_documents_uploaded >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usage_select_own" ON user_usage;
CREATE POLICY "usage_select_own"
  ON user_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usage_insert_own" ON user_usage;
CREATE POLICY "usage_insert_own"
  ON user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "usage_update_own" ON user_usage;
CREATE POLICY "usage_update_own"
  ON user_usage FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
