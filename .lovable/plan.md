
# Plano: Expansão do Identity Couple Premium para "Livro de Bordo Completo"

## Diagnóstico do Estado Atual

### O que já funciona bem:
| Seção | Status |
|-------|--------|
| Capa e Sumário | ✅ Completo |
| Metáfora do Barco | ✅ Renderiza |
| Tabela de Tradução | ✅ Conteúdo bom |
| Gráfico DISC | ✅ Visível |
| Processamento de Decisão (Nello 16) | ✅ Com dados |
| Ativações (Próximos Passos) | ✅ 5 passos práticos |

### O que está vazio ou incompleto:
| Seção | Problema |
|-------|----------|
| Página 3 - Zona de Ajuste | Apenas título, sem conteúdo |
| Página 8 - Protocolo de Paz + Ação 24h | Completamente vazio |
| Tela - Papéis Naturais | Card vazio (apenas título) |
| Tela - Tensões Naturais | Card vazio |
| Tela - Protocolo de Liderança | Card vazio |
| Geral - Falta atribuição de origem | Não cita de onde vem cada insight |
| Geral - Falta cenários de vida real | Carreira, Finanças, Saúde, Espiritualidade |

---

## Solução Proposta: 3 Frentes de Expansão

### Frente 1: Adicionar Seção "Cenários da Vida Real" (NOVO)

Nova seção obrigatória no JSON que gera conteúdo para 4 áreas críticas da vida conjugal:

**Estrutura proposta:**
```text
cenarios_vida_real: {
  titulo: "Navegando a Vida Juntos",
  carreira: {
    titulo: "Na Carreira e Trabalho",
    como_funciona: "Quando decisões de carreira surgirem...",
    papel_sensor: "Lisa tende a ponderar impactos de longo prazo...",
    papel_condutor: "Cristiano executa e implementa as mudanças...",
    origem: "[Isso vem do D alto de Cristiano combinado com o C alto de Lisa]",
    exemplo_pratico: "Ex: Se surgir uma proposta de mudança de cidade..."
  },
  financas: {
    titulo: "Nas Finanças do Casal",
    como_funciona: "Quando o assunto é dinheiro...",
    papel_sensor: "...",
    papel_condutor: "...",
    origem: "[Isso vem do temperamento Melancólico de Lisa + Colérico de Cristiano]",
    exemplo_pratico: "Ex: Na hora de decidir um investimento grande..."
  },
  saude: {
    titulo: "Na Saúde e Bem-Estar",
    como_funciona: "Quando questões de saúde aparecem...",
    exemplo_pratico: "Ex: Se um dos dois precisar mudar hábitos alimentares..."
  },
  espiritualidade: {
    titulo: "Na Espiritualidade e Propósito",
    como_funciona: "Quando buscam sentido e propósito...",
    exemplo_pratico: "Ex: Ao escolher uma comunidade de fé ou prática espiritual..."
  }
}
```

### Frente 2: Adicionar Citações de Origem (Rastreabilidade)

Cada insight importante deve incluir uma **tag de origem** explicando de qual teste/pilar vem aquela informação:

**Formato proposto:**
```text
"Cristiano tende a acelerar decisões sob pressão."
→ [Origem: DISC D=65%, Temperamento Colérico, Arquétipo Herói]

"Lisa precisa de tempo para processar antes de responder."
→ [Origem: DISC C=70%, Temperamento Melancólico, Nello16 ISTJ]
```

**Implementação técnica:**
- Adicionar campo `origem` em cada sub-objeto do JSON
- A IA deve citar explicitamente qual teste (DISC, Temperamento, Arquétipo, etc.) fundamenta cada afirmação
- Renderizar como badge/tag discreta na interface

### Frente 3: Preencher Seções Vazias com Conteúdo Obrigatório

Instruir a IA a gerar conteúdo **concreto e denso** para:

1. **Papéis Naturais**: Não apenas títulos, mas justificativas com origem
2. **Tensões Naturais**: Com exemplos de situações cotidianas
3. **Protocolo de Paz**: Regras específicas com rituais (ex: "Antes de discutir finanças, cada um escreve 3 pontos em papel")
4. **Ação 24h**: 3 passos imediatos e concretos

---

## Alterações Técnicas

### Arquivo 1: `supabase/functions/nello-codigo-cruzamento/index.ts`

**Mudanças no System Prompt:**
- Adicionar regra obrigatória de citação de origem
- Incluir estrutura `cenarios_vida_real` com 4 áreas

**Mudanças no JSON Schema:**
```json
{
  "cenarios_vida_real": {
    "titulo": "Navegando a Vida Juntos",
    "carreira": {
      "como_funciona": "OBRIGATÓRIO",
      "origem_insight": "OBRIGATÓRIO: [De onde vem: DISC X, Temperamento Y]",
      "exemplo_pratico": "OBRIGATÓRIO: Situação hipotética"
    },
    "financas": { ... },
    "saude": { ... },
    "espiritualidade": { ... }
  },
  "papeis_naturais": {
    "sensor_direcao": {
      "nome": "Lisa",
      "caracteristicas": "OBRIGATÓRIO",
      "origem": "OBRIGATÓRIO: [Isso vem do...]"
    },
    "condutor_curso": {
      "nome": "Cristiano",
      "caracteristicas": "OBRIGATÓRIO",
      "origem": "OBRIGATÓRIO: [Isso vem do...]"
    }
  }
}
```

**Nova regra no prompt:**
```text
═══════════════════════════════════════════════════════════════════════════════
REGRA DE RASTREABILIDADE (OBRIGATÓRIA)
═══════════════════════════════════════════════════════════════════════════════

Cada insight DEVE incluir a ORIGEM do dado:
- Formato: [Origem: NOME_TESTE + característica]
- Exemplos:
  - "[Origem: DISC D=65% de Cristiano]"
  - "[Origem: Temperamento Melancólico de Lisa]"
  - "[Origem: Arquétipo Mago + Inteligência Intrapessoal]"

Isso NUNCA deve estar vazio. O usuário PRECISA saber de onde vem cada insight.
═══════════════════════════════════════════════════════════════════════════════
```

### Arquivo 2: `src/components/codigo-essencia/CruzamentoViewer.tsx`

**Novos renderizadores:**
- `renderCenariosVidaReal()`: Cards para Carreira, Finanças, Saúde, Espiritualidade
- `renderOrigemBadge()`: Componente visual para exibir a tag de origem

**Ajustes em renderizadores existentes:**
- `renderPapeisNaturais()`: Adicionar campo `origem` se existir
- `renderTensoesNaturais()`: Mostrar exemplos práticos
- `renderProtocoloLideranca()`: Preencher com regras concretas

### Arquivo 3: `src/lib/pdfCodigoCasal.ts`

**Novos métodos:**
- `renderCenariosVidaReal()`: Seção de 2-3 páginas com os 4 cenários
- `renderOrigemTag()`: Texto em itálico/cinza para atribuição

**Ajustes:**
- Garantir que `papeis_naturais` renderize conteúdo, não apenas título
- Garantir que `protocolo_paz` e `acao_24h` tenham fallbacks inteligentes

---

## Exemplo de Resultado Esperado

### Seção "Carreira e Trabalho" (Nova)
```text
┌──────────────────────────────────────────────────────────────┐
│ 💼 NA CARREIRA E TRABALHO                                    │
├──────────────────────────────────────────────────────────────┤
│ Como vocês funcionam:                                        │
│ Cristiano tende a agir rapidamente em oportunidades          │
│ profissionais, enquanto Lisa prefere analisar riscos         │
│ antes de qualquer movimento.                                 │
│                                                              │
│ 🧭 Papel do Sensor (Lisa):                                   │
│ "Espera, vamos pensar nos próximos 3 anos antes de decidir." │
│ [Origem: DISC C=70%, Temperamento Melancólico]               │
│                                                              │
│ ⚓ Papel do Condutor (Cristiano):                             │
│ "Ok, mas não podemos perder essa oportunidade - vou agir."   │
│ [Origem: DISC D=65%, Temperamento Colérico]                  │
│                                                              │
│ 💡 Exemplo Prático:                                          │
│ Se surgir uma proposta de emprego em outra cidade:           │
│ 1. Cristiano, não tome a decisão sozinho no primeiro dia     │
│ 2. Lisa, dê uma análise em 48h, não 2 semanas                │
│ 3. Usem a regra: "Decisões de 5+ anos = Sensor lidera"       │
└──────────────────────────────────────────────────────────────┘
```

### Seção "Papéis Naturais" (Corrigido)
```text
┌──────────────────────────────────────────────────────────────┐
│ 🧭 SENSOR DE DIREÇÃO: Lisa Marini Ferreira dos Santos        │
├──────────────────────────────────────────────────────────────┤
│ Lisa enxerga o caminho antes de caminhar.                    │
│ Ela processa informações em profundidade e sente as          │
│ correntes emocionais do relacionamento antes que se          │
│ tornem tempestades.                                          │
│                                                              │
│ [Origem: Inteligência Intrapessoal 85%, DISC C=70%,          │
│  Arquétipo Mago, Temperamento Melancólico]                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Resultado Final Esperado

Um relatório de **15-20 páginas** que:

1. **Cobre todas as áreas da vida conjugal**: Carreira, Finanças, Saúde, Espiritualidade
2. **Cita a origem de cada insight**: O usuário sabe de onde vem cada informação
3. **Nenhuma seção vazia**: Fallbacks inteligentes baseados nos papéis
4. **Tom humano e prático**: Situações reais do dia-a-dia, não teoria abstrata
5. **Base sólida para outros usuários**: Este é o template definitivo

---

## Arquivos a Editar

| Arquivo | Tipo de Mudança |
|---------|-----------------|
| `supabase/functions/nello-codigo-cruzamento/index.ts` | Expandir prompt + JSON schema |
| `src/components/codigo-essencia/CruzamentoViewer.tsx` | Adicionar renderizadores |
| `src/lib/pdfCodigoCasal.ts` | Adicionar métodos de renderização |
