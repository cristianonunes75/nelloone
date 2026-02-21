
-- Add 'nello16' to the test_type enum (keeping 'mbti' for backward compatibility)
ALTER TYPE public.test_type ADD VALUE IF NOT EXISTS 'nello16';

-- Add comment to mark mbti as legacy
COMMENT ON TYPE public.test_type IS 'Test types. Note: mbti is LEGACY - use nello16 for all new records. linguagens_amor is LEGACY - use estilos_conexao for new records.';

-- Create a translation/mapping view for legacy → new identifiers
CREATE OR REPLACE VIEW public.test_type_mapping AS
SELECT 
  'mbti'::text AS legacy_type,
  'nello16'::text AS current_type,
  'Nello 16 Personality Map'::text AS display_name,
  true AS is_legacy
UNION ALL
SELECT 
  'linguagens_amor'::text,
  'estilos_conexao'::text,
  'Estilos de Conexão Afetiva'::text,
  true
UNION ALL
SELECT 'disc'::text, 'disc'::text, 'DISC'::text, false
UNION ALL
SELECT 'eneagrama'::text, 'eneagrama'::text, 'Eneagrama'::text, false
UNION ALL
SELECT 'temperamentos'::text, 'temperamentos'::text, 'Temperamentos'::text, false
UNION ALL
SELECT 'inteligencias_multiplas'::text, 'inteligencias_multiplas'::text, 'Inteligências Múltiplas'::text, false
UNION ALL
SELECT 'arquetipos_proposito'::text, 'arquetipos_proposito'::text, 'Arquétipos com Propósito'::text, false;

-- Create function to translate legacy test types to current ones
CREATE OR REPLACE FUNCTION public.resolve_test_type(input_type text)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $$
  SELECT CASE input_type
    WHEN 'mbti' THEN 'nello16'
    WHEN 'linguagens_amor' THEN 'estilos_conexao'
    ELSE input_type
  END;
$$;
