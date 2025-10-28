-- Add stripe_price_id to tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Update tests with Stripe price IDs
UPDATE tests SET stripe_price_id = 'price_1SNBIuDjhZZxZELMm3qUtTON' WHERE type = 'disc';
UPDATE tests SET stripe_price_id = 'price_1SNBJEDjhZZxZELMY1CuVfIZ' WHERE type = 'mbti';
UPDATE tests SET stripe_price_id = 'price_1SNBLhDjhZZxZELMhSvpHn8X' WHERE type = 'eneagrama';

-- Add metadata column to test_purchases for storing multiple test IDs
ALTER TABLE test_purchases ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;