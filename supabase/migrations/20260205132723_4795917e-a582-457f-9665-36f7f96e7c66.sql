-- Add tracking columns to ai_messages for test context
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS test_context text;
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';