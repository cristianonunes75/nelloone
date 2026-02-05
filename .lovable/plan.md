
# AUDITORIA COMPLETA - Assistente Nello Chat AI para Resultados

## 1. FRONTEND - Componentes Existentes

### Componentes de Chat já implementados:
| Arquivo | Status | Uso Atual |
|---------|--------|-----------|
| `src/components/cliente/NelloConcierge.tsx` | ✅ Existe | ⚠️ **NÃO UTILIZADO** |
| `src/hooks/useAIChat.tsx` | ✅ Existe | ⚠️ **NÃO UTILIZADO** |

### Componentes Flutuantes na área de resultados:
| Arquivo | Status | Função |
|---------|--------|--------|
| `src/components/cliente/ResultsFloatingMenu.tsx` | ✅ Em uso | Botões de PDF, Share, Continuar, Home |

### Página de Resultados:
- **Arquivo**: `src/pages/TestResults.tsx` (1201 linhas)
- **Rota**: `/:lang?/resultados/:userTestId`
- **Já usa**: `ResultsFloatingMenu` no canto inferior direito
- **Não usa**: `NelloConcierge`

### Conflito identificado:
O `ResultsFloatingMenu` ocupa `bottom-6 right-6` - mesma posição onde o novo widget seria colocado.

---

## 2. EDGE FUNCTIONS - AI/Chat

### Funções existentes relacionadas:
| Função | Propósito | API |
|--------|-----------|-----|
| `nello-concierge` | Chat genérico Nello | Lovable AI (gemini-2.5-flash) |
| `flow-mentor` | Mentor do Nello Flow | Lovable AI (gemini-3-flash-preview) |

### Outras funções AI (21 total):
- `generate-essence-reading`, `nello-ativacao-codigo`, `nello-codigo-essencia`, `nello-relatorio-contextual`, etc.

### Recomendação:
Criar uma **NOVA** edge function `chat-ai` específica para os resultados, com:
- Recebe `test_context` (tipo do teste)
- Retorna `was_upsell: boolean` e `cta_url: string`
- Lógica de proteção da Ativação como upsell

---

## 3. BANCO DE DADOS - Tabelas de Chat/Mensagens

### Tabelas existentes:
| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `ai_conversations` | Conversas do Nello | ✅ `user_id = auth.uid()` |
| `ai_messages` | Mensagens de chat | ✅ Via `ai_conversations.user_id` |
| `flow_chats` | Chat do Nello Flow | ✅ `user_id = auth.uid()` |

### Schema de `ai_messages`:
```text
id              uuid       NOT NULL
conversation_id uuid       NOT NULL
role            text       NOT NULL
content         text       NOT NULL
created_at      timestamp  NOT NULL
```

### Schema de `ai_conversations`:
```text
id         uuid       NOT NULL
user_id    uuid       NOT NULL
title      text       NULLABLE
created_at timestamp  NOT NULL
updated_at timestamp  NOT NULL
```

### Recomendação:
**REUTILIZAR** as tabelas existentes (`ai_conversations` e `ai_messages`). Não criar novas tabelas.

Adicionar apenas 2 colunas opcionais:
```sql
ALTER TABLE ai_messages ADD COLUMN test_context text;
ALTER TABLE ai_messages ADD COLUMN metadata jsonb DEFAULT '{}';
```

---

## 4. RESULTADOS DOS TESTES - Armazenamento

### Tabelas confirmadas:
| Tabela | Campo Importante | Função |
|--------|------------------|--------|
| `profiles` | `ativacao_codigo_unlocked` | ✅ **EXISTE** |
| `user_tests` | `result_data` (jsonb) | Resultados calculados |
| `mapa_essencia` | `sections` (jsonb) | Código da Essência |

### Campo `ativacao_codigo_unlocked`:
- **Tipo**: `boolean`
- **Nullable**: `YES`
- **Default**: `NULL` (false)
- **Já em uso**: Em 8 arquivos do frontend

---

## 5. SEGURANÇA E RLS

### Políticas existentes para chat:

| Tabela | Política | Regra |
|--------|----------|-------|
| `ai_conversations` | INSERT | `user_id = auth.uid()` |
| `ai_conversations` | SELECT | `user_id = auth.uid()` |
| `ai_conversations` | UPDATE | `user_id = auth.uid()` |
| `ai_conversations` | DELETE | `user_id = auth.uid()` |
| `ai_messages` | INSERT | Via `ai_conversations.user_id` |
| `ai_messages` | SELECT | Via `ai_conversations.user_id` |

### Análise de segurança:
- ✅ Usuários só veem suas próprias mensagens
- ✅ Admins **NÃO** têm acesso às mensagens (seguindo padrão de isolamento)
- ⚠️ A edge function `nello-concierge` usa `VITE_SUPABASE_PUBLISHABLE_KEY` (ok para chat público)

### Para a nova edge function `chat-ai`:
- Validar `auth.uid()` via JWT
- Não usar service role para leitura de resultados
- Buscar resultados via RLS do próprio usuário

---

## 6. UX NA PÁGINA DE RESULTADOS

### Localização exata:
- **Arquivo**: `src/pages/TestResults.tsx`
- **Linha 1173-1188**: `ResultsFloatingMenu` já ocupa o canto inferior direito
- **Rota**: `/:lang?/resultados/:userTestId`

### Posicionamento proposto:
O `ResultsFloatingMenu` já ocupa `bottom-6 right-6`. O novo widget Nello deve:
- Ficar **acima** do menu existente
- Ou substituir parcialmente com novo design integrado

---

## 7. RECOMENDAÇÃO FINAL

### ❌ CONFLITOS ENCONTRADOS:
1. `NelloConcierge.tsx` existe mas **não é usado** - pode ser refatorado
2. `ResultsFloatingMenu.tsx` ocupa mesma posição - precisa reorganizar
3. `useAIChat.tsx` não suporta `test_context` nem `was_upsell` - precisa adaptar

### ✅ O QUE JÁ EXISTE E DEVE SER REUTILIZADO:
1. Tabelas `ai_conversations` e `ai_messages` - **reutilizar**
2. Edge function `nello-concierge` - **usar como base** para `chat-ai`
3. Campo `profiles.ativacao_codigo_unlocked` - **já existe**
4. Padrão de streaming SSE do `useAIChat.tsx` - **reutilizar lógica**

### 🚫 O QUE NÃO FAZER:
1. Não criar tabela `chat_messages` nova
2. Não duplicar lógica de streaming
3. Não colocar widget na mesma posição exata do `ResultsFloatingMenu`
4. Não expor prompts no frontend

---

## PLANO DE IMPLEMENTAÇÃO SEGURO - 4 ETAPAS

### Etapa 1: Backend (Edge Function)
```text
Criar: supabase/functions/chat-ai/index.ts

Recebe:
- message: string
- session_id: uuid (opcional)
- test_context: "disc" | "eneagrama" | etc.

Retorna:
- content: string
- was_upsell: boolean
- upsell_type: string (opcional)
- cta_url: string (opcional)

Lógica de upsell:
- Se pergunta sobre "como aplicar", "coaching", "profissional" → was_upsell = true
- cta_url → link para compra da Ativação
```

### Etapa 2: Banco de Dados (Opcional)
```sql
-- Opcional: adicionar campos para tracking
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS test_context text;
ALTER TABLE ai_messages ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';
```

### Etapa 3: Frontend - Novo Componente
```text
Criar: src/components/cliente/NelloResultsChat.tsx

Features:
- Botão flutuante "Pergunte para o Nello"
- Modal/Drawer com chat
- Chips de perguntas rápidas
- Card de upsell quando was_upsell = true
- Recebe testType como prop
```

### Etapa 4: Integração na Página
```text
Modificar: src/pages/TestResults.tsx

- Importar NelloResultsChat
- Passar testType baseado em userTest.tests?.type
- Posicionar acima ou ao lado do ResultsFloatingMenu
```

---

## DIAGRAMA DE ARQUITETURA

```text
┌─────────────────────────────────────────────────────────────┐
│                    TestResults.tsx                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Resultado do Teste                    │   │
│  │         (DISC, Eneagrama, Temperamentos, etc.)      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐ │
│  │ NelloResultsChat     │  │ ResultsFloatingMenu         │ │
│  │ (NOVO)               │  │ (existente)                 │ │
│  │ bottom-6 right-24    │  │ bottom-6 right-6            │ │
│  └──────────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│               Edge Function: chat-ai                        │
│                                                             │
│  • System prompt com persona Nello                          │
│  • Recebe test_context para contextualizar respostas       │
│  • Lógica de upsell para Ativação do Código                │
│  • Retorna was_upsell + cta_url                            │
└─────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│          Lovable AI Gateway (gemini-3-flash-preview)        │
└─────────────────────────────────────────────────────────────┘
```
