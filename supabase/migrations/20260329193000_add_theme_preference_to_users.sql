ALTER TABLE users
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'purple';
