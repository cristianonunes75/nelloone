-- Fix function search path for update_home_content_timestamp
CREATE OR REPLACE FUNCTION update_home_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;