
# Plano: Correções Completas do Nello Business (Hiring)

## Problemas Identificados

### Problema 1: E-mail de convite NÃO é enviado ao criar candidato
**Causa**: Ao adicionar um candidato em `BusinessHiring.tsx` (linhas 144-155), o sistema apenas insere no banco de dados. Não existe chamada para enviar e-mail.

**Evidência**: O campo `invite_sent_at` foi preenchido automaticamente pelo trigger do banco, mas **nenhuma edge function foi executada** para enviar o e-mail real.

### Problema 2: Respostas não são salvas (RLS)
**Causa**: Candidatos acessam a avaliação **sem login** (anônimos). As políticas RLS bloqueiam updates diretos nas tabelas `hiring_candidates`, `hiring_assessments` e `hiring_answers`.

**Evidência**: Mesmo que Suzanne tenha acessado o link e "completado" na interface, o banco mostra `status: pending` e `0 hiring_answers`.

---

## Solução Técnica

### Parte 1: Corrigir envio de e-mail ao criar candidato

**Arquivo**: `src/apps/business/pages/BusinessHiring.tsx`

Após inserir o candidato com sucesso (linha 155), chamar a edge function `business-resend-assessment` para enviar o e-mail inicial:

```typescript
// Após linha 155 (se não for importar dados existentes OU sempre)
if (data && !importExisting) {
  await supabase.functions.invoke("business-resend-assessment", {
    body: { candidate_id: data.id }
  });
}
```

**Alternativa mais robusta**: Criar uma nova edge function `business-send-candidate-invite` específica para o primeiro envio, com template diferente do "reenvio".

### Parte 2: Corrigir salvamento de respostas (3 funções SECURITY DEFINER)

**Arquivo**: Nova migration SQL

| Função | Descrição |
|--------|-----------|
| `save_hiring_answer` | Salva resposta individual verificando token |
| `start_hiring_assessment` | Inicia teste, atualiza status para `in_progress` |
| `complete_hiring_assessment` | Finaliza teste, salva `result_data` |

```sql
-- Exemplo: save_hiring_answer
CREATE OR REPLACE FUNCTION public.save_hiring_answer(
  _invite_token text,
  _assessment_id uuid,
  _question_id uuid,
  _question_number integer,
  _answer jsonb
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE
  v_candidate_id uuid;
BEGIN
  -- Validar token
  SELECT id INTO v_candidate_id FROM hiring_candidates
  WHERE invite_token = _invite_token
  AND (invite_expires_at IS NULL OR invite_expires_at > now());
  
  IF v_candidate_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verificar se assessment pertence ao candidato
  IF NOT EXISTS (
    SELECT 1 FROM hiring_assessments 
    WHERE id = _assessment_id AND candidate_id = v_candidate_id
  ) THEN
    RETURN false;
  END IF;
  
  -- Upsert resposta
  INSERT INTO hiring_answers (assessment_id, question_id, question_number, answer)
  VALUES (_assessment_id, _question_id, _question_number, _answer)
  ON CONFLICT (assessment_id, question_number) 
  DO UPDATE SET answer = _answer, question_id = _question_id;
  
  RETURN true;
END;
$$;
```

### Parte 3: Atualizar frontend para usar as funções

**Arquivo**: `src/apps/business/pages/BusinessHiringAssessment.tsx`

| Método atual | Novo método |
|--------------|-------------|
| `supabase.from("hiring_answers").insert(...)` | `supabase.rpc("save_hiring_answer", {...})` |
| `supabase.from("hiring_assessments").update({status: "in_progress"})` | `supabase.rpc("start_hiring_assessment", {...})` |
| `supabase.from("hiring_assessments").update({status: "completed", result_data})` | `supabase.rpc("complete_hiring_assessment", {...})` |

Adicionar tratamento de erro explícito:
```typescript
const { data: success, error } = await supabase.rpc("save_hiring_answer", {...});
if (!success || error) {
  toast.error("Erro ao salvar resposta. Verifique sua conexão.");
  return; // Bloqueia progressão
}
```

### Parte 4: Resetar candidata Suzanne

Após aplicar as correções, executar:
```sql
-- Resetar para poder refazer
UPDATE hiring_candidates 
SET status = 'pending', consent_given_at = NULL 
WHERE id = '532882b8-8a96-4cbb-be32-f3c8e71a4ccb';

UPDATE hiring_assessments
SET status = 'pending', started_at = NULL, completed_at = NULL, result_data = NULL
WHERE candidate_id = '532882b8-8a96-4cbb-be32-f3c8e71a4ccb';

DELETE FROM hiring_answers
WHERE assessment_id IN (
  SELECT id FROM hiring_assessments 
  WHERE candidate_id = '532882b8-8a96-4cbb-be32-f3c8e71a4ccb'
);
```

Depois, usar a função "Reenviar Avaliação" no painel para enviar o e-mail.

---

## Arquivos a Modificar

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| Nova migration SQL | Database | Criar 3 funções SECURITY DEFINER |
| `src/apps/business/pages/BusinessHiring.tsx` | Frontend | Enviar e-mail após criar candidato |
| `src/apps/business/pages/BusinessHiringAssessment.tsx` | Frontend | Usar RPCs + tratamento de erro |
| SQL manual | Database | Resetar candidata Suzanne |

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Criar candidato | Não envia e-mail | Envia e-mail automaticamente |
| Candidato responde | Falha silenciosa (RLS) | Salva via RPC segura |
| Candidato finaliza | Status fica "pending" | Status muda para "completed" |
| Erro ao salvar | Interface mostra "done" | Toast de erro + bloqueio |
