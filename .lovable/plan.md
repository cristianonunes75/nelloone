

# Plano: Transformar o Relatório do Casal em "Livro de Bordo Premium"

## Diagnóstico Completo

Após análise detalhada do PDF gerado e do código-fonte, identifiquei os seguintes problemas:

### Páginas Vazias / Incompletas
| Página | Seção | Status Atual |
|--------|-------|--------------|
| 3 | Semáforo Relacional / Zona de Ajuste | Vazia - apenas título |
| 8 | Arquétipos | Mostra "Sombra: undefined" |
| 9 | Linguagens de Conexão | Micro acordos truncados |
| 11 | Tabela de Tradução | Completamente vazia |
| 12 | Protocolo de Paz + Ação 24h | Apenas títulos |

### Problema Principal
O conteúdo gerado pela IA (edge function) está estruturado, mas:
1. Não está sendo mapeado corretamente para o gerador de PDF
2. Falta densidade reflexiva com frases do tipo "Considere fazer X para que Y sinta Z"
3. O prompt v2.1 não enfatiza geração de conteúdo prático do dia-a-dia

---

## Solução Proposta: 3 Frentes

### Frente 1: Enriquecer o Prompt da IA (Edge Function)
Adicionar instruções explícitas para gerar "Prompts Reflexivos" em cada seção:

```text
REGRA DE DENSIDADE DE CONTEÚDO:
Para cada seção, inclua pelo menos 2-3 "Prompts Reflexivos" no formato:
- "Considere [AÇÃO ESPECÍFICA] para que [NOME] perceba [RESULTADO]"
- "Quando [SITUAÇÃO], experimente [AÇÃO] - isso mostra a [NOME] que [MENSAGEM]"
- "Evite [COMPORTAMENTO] pois [NOME] pode interpretar como [MAL-ENTENDIDO]"

Exemplos obrigatórios por seção:
- zona_ajuste: "Cristiano, considere pausar 30 segundos antes de cobrar resposta. Lisa verá isso como respeito pelo tempo dela."
- linguagens_conexao: "Lisa, quando Cristiano pedir 'tempo juntos', entenda como 'preciso me sentir importante para você'."
- protocolo_paz: "Antes de discutir finanças, pergunte: 'Qual resultado queremos?' Isso alinha expectativas."
```

### Frente 2: Expandir a Estrutura JSON do Prompt
Adicionar campos obrigatórios para conteúdo reflexivo:

```json
{
  "zona_ajuste": {
    "ponto_principal": "...",
    "risco_se_nao_ajustar": "...",
    "ajuste_proposto": "...",
    "reflexoes_praticas": [
      {
        "para": "[NOME_A]",
        "acao": "Considere fazer X",
        "efeito": "para que [NOME_B] sinta Y"
      }
    ],
    "micro_acordos": [...]
  },
  "tabela_traducao": {
    "traducoes_sensor": [...],
    "traducoes_condutor": [...],
    "reflexoes_diarias": [
      {
        "situacao": "Quando ele/ela se cala",
        "considere": "Pergunte 'Você precisa de tempo ou de companhia?' ao invés de pressionar"
      }
    ]
  },
  "protocolo_paz": {
    "regras": [...],
    "rituais_diarios": [
      "Todo fim de semana, dediquem 10 minutos para a 'Pergunta do Barco': Como estamos navegando?",
      "Antes de dormir, compartilhem uma gratidão específica sobre o outro"
    ]
  }
}
```

### Frente 3: Corrigir o Mapeamento no PDF Generator
1. **Sanitizar "undefined"** - Remover qualquer texto com "undefined"
2. **Fallbacks inteligentes** - Se `reflexoes_praticas` vier vazio, gerar baseado no DISC
3. **Preencher seções vazias** - Usar `coupleSynergyLogic.ts` para gerar conteúdo dinâmico

---

## Novas Seções de Conteúdo Sugeridas

### 1. "Ritual Semanal do Casal" (Nova seção)
```
Toda semana, reservem 15 minutos para o "Check-in do Barco":
1. Como você se sentiu amado(a) esta semana?
2. O que poderia ter sido diferente?
3. Qual é o nosso foco para a próxima semana?
```

### 2. "Frases que Constroem" (Expandir Tabela de Tradução)
| Ao invés de... | Experimente dizer... | Por que funciona |
|----------------|----------------------|------------------|
| "Você nunca me ouve" | "Sinto que preciso ser mais ouvido(a)" | Evita defensividade |
| "Sempre faço tudo" | "Gostaria de dividir X com você" | Convite, não acusação |

### 3. "Alertas do Dia-a-Dia" (Enriquecer Alertas de Pressão)
```
⚠️ ALERTA: Cristiano sob pressão tende a acelerar decisões
   Considere: Lisa, se perceber pressa excessiva, sugira "Vamos listar os prós e contras juntos"
   Efeito: Cristiano sentirá que você está apoiando, não freando

⚠️ ALERTA: Lisa sob pressão tende a se recolher
   Considere: Cristiano, evite interpretar silêncio como rejeição. Pergunte "Precisa de espaço ou quer conversar?"
   Efeito: Lisa sentirá respeito pelo seu tempo de processamento
```

---

## Alterações Técnicas Necessárias

### Arquivo 1: `supabase/functions/nello-codigo-cruzamento/index.ts`
- Expandir prompt com instruções de densidade reflexiva
- Adicionar campos obrigatórios no JSON Schema
- Incluir exemplos concretos de "Considere fazer X"

### Arquivo 2: `src/lib/pdfCodigoCasal.ts`
- Adicionar método `renderReflectivePrompts()` para nova formatação
- Corrigir `renderTranslationTable()` para não ficar vazia
- Sanitizar "undefined" em todos os campos de texto
- Adicionar fallbacks usando `coupleSynergyLogic.ts`

### Arquivo 3: `src/lib/coupleSynergy7Pillars.ts`
- Expandir `generate7PillarSynergy()` com reflexões práticas
- Adicionar função `generateDailyReflections()` 

---

## Resultado Esperado

Um PDF de 15-20 páginas onde:
- Cada seção tem pelo menos 2-3 reflexões práticas personalizadas
- Nenhum campo mostra "undefined" ou fica vazio
- O casal lê e sente que é um "livro de bordo" com ações claras
- Tom maduro, sem infantilização, focado em proteção do vínculo

---

## Seções Técnicas (Para Implementação)

### Prompt v2.2 - Adições ao System Prompt

```text
═══════════════════════════════════════════════════════════════════════════════
REGRA CRÍTICA: DENSIDADE REFLEXIVA (LIVRO DE BORDO)
═══════════════════════════════════════════════════════════════════════════════

Este relatório é um LIVRO DE BORDO PREMIUM. Cada seção DEVE conter:

1. PROMPTS REFLEXIVOS (mínimo 2-3 por seção):
   - Formato: "Considere [AÇÃO] para que [NOME] perceba/sinta [RESULTADO]"
   - Exemplo: "Lisa, considere verbalizar 'preciso de 10 minutos' antes de se recolher. Cristiano interpretará como comunicação, não rejeição."

2. RITUAIS PRÁTICOS (mínimo 1 por seção):
   - Formato: "[FREQUÊNCIA], façam [AÇÃO ESPECÍFICA]"
   - Exemplo: "Toda noite, antes de dormir, cada um diz UMA coisa que apreciou no outro hoje."

3. FRASES-PONTE (em seções de conflito):
   - Ao invés de: "Você sempre..."
   - Experimente: "Quando [situação], eu sinto [emoção]. Podemos [proposta]?"

4. NUNCA DEIXAR SEÇÕES VAZIAS:
   - Se não houver dados específicos, gere conteúdo baseado nos papéis (Sensor/Condutor)
   - Use fallbacks inteligentes: "Como casal com dinâmica [TIPO], vocês podem..."
```

