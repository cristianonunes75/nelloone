
# Plano: Exibir Resultados Parciais Assim que Cada Teste For Concluído

## Problema Atual

A página de detalhes do candidato (`BusinessHiringResults.tsx`) só exibe resultados quando **ambos os testes** (DISC e Temperamentos) estão completos. Enquanto isso, mostra apenas uma mensagem "Aguardando avaliações" com badges indicando o status de cada teste.

Isso significa que quando a Dariane termina o DISC, você não vê o resultado - precisa esperar ela terminar também o Temperamentos.

---

## Solução Proposta

### 1. Reestruturar a Lógica de Exibição

Substituir a lógica binária atual:

```text
SE ambos_completos:
   mostrar_relatório_completo
SENÃO:
   mostrar_aguardando
```

Por uma lógica incremental:

```text
SE disc_completo:
   mostrar_card_DISC
SENÃO:
   mostrar_progresso_DISC (se iniciado) ou badge_pendente

SE temperamentos_completo:
   mostrar_card_Temperamento
SENÃO:
   mostrar_progresso_Temperamentos (se iniciado) ou badge_pendente

SE ambos_completos:
   mostrar_cards_adicionais (Resumo Executivo, Pontos Fortes, etc.)
```

### 2. Adicionar Atualização em Tempo Real

Conectar a página de detalhes ao Realtime do Supabase para atualizar automaticamente quando um teste for concluído (sem precisar recarregar a página).

### 3. Indicador Visual de Progresso

Para testes em andamento, mostrar qual pergunta o candidato está respondendo (usando os dados de `current_question_number` que já salvamos).

---

## Mudanças Técnicas

### Arquivo: `src/apps/business/pages/BusinessHiringResults.tsx`

**1. Adicionar Subscription Realtime:**

```text
useEffect(() => {
  // Subscribe to assessment changes for this candidate
  const channel = supabase
    .channel('candidate-assessments')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'hiring_assessments',
      filter: `candidate_id=eq.${candidateId}`,
    }, () => fetchCandidateData())
    .subscribe();
  
  return () => supabase.removeChannel(channel);
}, [candidateId]);
```

**2. Criar Componente de Progresso ao Vivo:**

```text
function TestProgressCard({ assessment, testType }) {
  SE status === 'completed':
    retornar Card com resultado completo
  SE status === 'in_progress':
    retornar Card com progresso (Pergunta X/Y + barra de progresso)
  SENÃO:
    retornar Card com status "Pendente"
}
```

**3. Substituir a Seção Condicional (linhas 373-475):**

```text
Antes:
{bothCompleted ? (
  <RelatórioCompleto />
) : (
  <CardAguardando />
)}

Depois:
{/* Cards individuais - sempre visíveis */}
<PartialDISCCard 
  assessment={discAssessment} 
  status={discAssessment?.status} 
/>

<PartialTemperamentCard 
  assessment={temperamentAssessment} 
  status={temperamentAssessment?.status} 
/>

{/* Cards combinados - só quando ambos completos */}
{bothCompleted && (
  <>
    <ExecutiveSummaryCard ... />
    <StrengthsCard ... />
    ...
  </>
)}
```

---

## Estrutura Visual Proposta

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Dariane dos Santos Martins                          ⏱️ 1/2 Testes  │
│  Relatório de Avaliação Comportamental                              │
├─────────────────────────────────────────────────────────────────────┤
│  📧 email  📞 telefone  💼 cargo  📅 data                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  🎯 Perfil DISC                                    ✅ COMPLETO      │
├─────────────────────────────────────────────────────────────────────┤
│  [D] Dominância    [I] Influência   [S] Estabilidade  [C] Conform. │
│   🟠 Predominante   ⚪ Baixo          ⚪ Moderado       ⚪ Baixo     │
│                                                                      │
│  Perfil predominante: D - Dominância                                 │
│  "Foco em resultados, direto, assertivo..."                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  🔥 Temperamentos                                  ⏳ EM ANDAMENTO   │
├─────────────────────────────────────────────────────────────────────┤
│  Pergunta 23 de 40                                                  │
│  [████████████████░░░░░░░░░░░░░░░░░░░░░░░░] 57%                     │
│                                                                      │
│  Última atividade: há 2 minutos                                     │
│  🟢 Candidato ativo agora                                           │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  📊 Resumo Executivo                       │
│  (Disponível quando ambos os testes       │
│   estiverem completos)                     │
└────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

| Arquivo | Descrição |
|---------|-----------|
| `src/apps/business/pages/BusinessHiringResults.tsx` | Adicionar realtime subscription, refatorar layout para mostrar resultados parciais |

---

## Benefícios

1. **Visibilidade Imediata**: Ver o resultado do DISC assim que a Dariane terminar, sem esperar o Temperamentos
2. **Acompanhamento ao Vivo**: Ver em qual pergunta o candidato está durante o teste
3. **Sem Refresh Manual**: A página atualiza automaticamente via Realtime
4. **Progressão Visual**: Entender claramente o status de cada teste individualmente
