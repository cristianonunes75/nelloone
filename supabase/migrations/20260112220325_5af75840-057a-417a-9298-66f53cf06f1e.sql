-- Adicionar colunas para identificar dados importados
ALTER TABLE hiring_assessments 
ADD COLUMN IF NOT EXISTS imported_from_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS original_completed_at timestamptz;

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_hiring_assessments_imported 
ON hiring_assessments(imported_from_user_id) WHERE imported_from_user_id IS NOT NULL;

-- Comentário para documentação
COMMENT ON COLUMN hiring_assessments.imported_from_user_id IS 'ID do usuário Nello One de onde os dados foram importados';
COMMENT ON COLUMN hiring_assessments.original_completed_at IS 'Data original de conclusão do teste no Nello One';