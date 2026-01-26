

# Plano: Garantir Persistência de Testes de Recrutamento + Monitoramento em Tempo Real

## Diagnóstico do Problema

Identifiquei **dois problemas críticos** que causaram a perda de dados do Paulo Haruo e podem afetar outros candidatos:

### 1. Política de Segurança (RLS) com Status Incorreto
A política de INSERT na tabela `hiring_answers` verifica:
```text
status IN ('pending', 'assessment_sent', 'assessment_started')
```

**Problema**: Quando o candidato começa o teste, o status muda para `in_progress` - que **não está na lista permitida**! Isso bloqueia a inserção de respostas.

### 2. Falta de Política de UPDATE
O código tenta atualizar respostas existentes (quando o candidato volta a uma pergunta), mas **não existe política de UPDATE** para a tabela `hiring_answers`. Com RLS ativado, isso é bloqueado automaticamente.

---

## Solução Proposta

### Fase 1: Corrigir Políticas de Segurança (RLS)

Criar uma migração de banco de dados que:

1. **Atualiza a política de INSERT** em `hiring_answers` para incluir `in_progress` e `completed`
2. **Cria política de UPDATE** permitindo que candidatos editem suas próprias respostas
3. **Aplica a mesma correção** nas políticas de `hiring_assessments`

### Fase 2: Melhorar Tratamento de Erros no Frontend

Atualizar `BusinessHiringAssessment.tsx`:

1. **Auto-retry** com backoff exponencial quando uma operação falha
2. **Indicador visual de salvamento** para cada resposta
3. **Modo offline** que armazena respostas localmente e sincroniza quando a conexão voltar
4. **Validação final** antes de completar o teste verificando se todas as respostas estão salvas

### Fase 3: Implementar Monitoramento em Tempo Real

Criar funcionalidade para acompanhar candidatos em tempo real:

1. **Ativar Realtime** nas tabelas `hiring_assessments` e `hiring_candidates`
2. **Criar componente de monitoramento** no painel de recrutamento
3. **Exibir informações em tempo real**:
   - Qual teste o candidato está fazendo
   - Em qual pergunta está (ex: "Pergunta 15/28")
   - Última atividade (há quanto tempo)
   - Status de conclusão

---

## Detalhes Técnicos

### Migração de Banco de Dados

```text
-- 1. Corrigir política de INSERT em hiring_answers
DROP POLICY IF EXISTS "Secure answer insert" ON public.hiring_answers;
CREATE POLICY "Secure answer insert" ON public.hiring_answers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM hiring_assessments ha
    JOIN hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'in_progress')
  )
  OR ... [admin check]
);

-- 2. Criar política de UPDATE (NOVA)
CREATE POLICY "Secure answer update" ON public.hiring_answers
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM hiring_assessments ha
    JOIN hiring_candidates hc ON hc.id = ha.candidate_id
    WHERE ha.id = hiring_answers.assessment_id
    AND hc.invite_token IS NOT NULL
    AND hc.status IN ('pending', 'assessment_sent', 'assessment_started', 'in_progress')
  )
  OR ... [admin check]
);

-- 3. Ativar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE hiring_assessments;
ALTER PUBLICATION supabase_realtime ADD TABLE hiring_candidates;
```

### Componente de Monitoramento

Será exibido como um card ou seção no painel `/business/recrutamento`:

```text
┌─────────────────────────────────────────────────────────────┐
│ 👁️ MONITORAMENTO AO VIVO                      [Atualização automática] │
├─────────────────────────────────────────────────────────────┤
│ 🟢 Dariane Martins     │ DISC      │ Pergunta 25/28 │ Agora │
│ 🟡 Manoela Pereira     │ DISC      │ Pergunta 23/28 │ 2 min │
│ ⚪ Barbara Lorrane     │ -         │ Não iniciou    │ -     │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Salvamento Melhorado

```text
┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  Responder   │────▶│   Salvar    │────▶│ Verificar   │
│  Pergunta    │     │   no DB     │     │ Sucesso     │
└──────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                           ┌────────────────────┼────────────────────┐
                           │                    │                    │
                           ▼                    ▼                    ▼
                     ┌───────────┐        ┌───────────┐        ┌───────────┐
                     │ Sucesso   │        │ Retry x3  │        │ Salvar    │
                     │ Avançar   │        │ c/Backoff │        │ Local     │
                     └───────────┘        └───────────┘        └───────────┘
```

---

## Arquivos a Serem Modificados/Criados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/migrations/xxx_fix_hiring_rls.sql` | Criar | Corrige políticas RLS |
| `src/apps/business/pages/BusinessHiringAssessment.tsx` | Editar | Adiciona retry, indicadores visuais |
| `src/apps/business/components/LiveCandidateMonitor.tsx` | Criar | Componente de monitoramento em tempo real |
| `src/apps/business/pages/BusinessHiring.tsx` | Editar | Integra monitoramento + realtime subscription |

---

## Benefícios

1. **Confiabilidade**: Respostas não serão mais bloqueadas pelas políticas de RLS
2. **Visibilidade**: Você verá exatamente quem está fazendo testes e o progresso
3. **Diagnóstico**: Se algo falhar, você saberá imediatamente
4. **Experiência**: Candidatos terão feedback visual de que suas respostas estão sendo salvas

