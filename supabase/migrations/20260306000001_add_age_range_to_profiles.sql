-- Add age_range to profiles for personalized Código da Essência generation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_range text;

COMMENT ON COLUMN profiles.age_range IS 'User age range for personalized report context: 15-24, 25-34, 35-44, 45-54, 55-64, 65+';
