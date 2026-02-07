

# Plano: Monitoramento ao Vivo para Nello Identity

## Visão Geral

Ampliar a funcionalidade de monitoramento em tempo real (já existente no Hiring) para o Nello Identity, permitindo ver quem está fazendo testes neste momento, com progresso e indicador de atividade.

---

## O que será criado

Um novo componente **LiveTestMonitor** que mostrará:

- Lista de usuários com testes em andamento
- Qual teste cada pessoa está fazendo (DISC, Eneagrama, Arquétipos, etc.)
- Barra de progresso (ex: 31/36 perguntas)
- Indicador visual de atividade:
  - 🟢 Verde pulsante = ativo nos últimos 2 min
  - 🟡 Amarelo = ativo nos últimos 10 min
  - ⚪ Cinza = inativo

---

## Onde ficará

O monitor será adicionado em **duas localizações**:

1. **Dashboard Admin Principal** (`/admin`) - Card compacto no topo
2. **Dashboard Tempo Real** (`/admin/tempo-real`) - Versão expandida

---

## Arquitetura

```text
┌─────────────────────────────────────────────────────────┐
│                    LiveTestMonitor                       │
├─────────────────────────────────────────────────────────┤
│  Dados:                                                  │
│  - user_tests (status = 'in_progress')                  │
│  - test_answers (count por user_test_id)                │
│  - test_questions (count por test_id)                   │
│  - profiles (nome do usuário)                           │
│  - tests (nome do teste)                                │
├─────────────────────────────────────────────────────────┤
│  Realtime:                                               │
│  - Subscribe em user_tests (UPDATE)                     │
│  - Subscribe em test_answers (INSERT)                   │
│  - Fallback: refresh a cada 30s                         │
└─────────────────────────────────────────────────────────┘
```

---

## Dados Atuais (prova de conceito)

Usuários com testes em andamento agora:

| Usuário | Teste | Progresso |
|---------|-------|-----------|
| Janaina Megda | Arquétipos | 31/36 (86%) |
| Teste | DISC | ?/28 |
| Suami Albuquerque | Eneagrama | ?/114 |
| Saula Sabrina | Estilos de Conexão | ?/30 |

---

## Implementação

### Passo 1: Migração SQL

Habilitar realtime nas tabelas necessárias:

```sql
-- Habilitar realtime para test_answers (rastrear progresso)
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_answers;

-- user_tests provavelmente já está habilitado (verificar)
```

### Passo 2: Criar componente LiveTestMonitor

**Arquivo:** `src/components/admin/LiveTestMonitor.tsx`

Funcionalidades:
- Buscar `user_tests` com status `in_progress`
- JOIN com `profiles` (nome), `tests` (nome do teste)
- Contar respostas em `test_answers` vs total em `test_questions`
- Calcular progresso percentual
- Indicador de atividade baseado em `user_tests.updated_at`
- Subscriptions realtime em `user_tests` e `test_answers`

### Passo 3: Integrar no RealtimeDashboard

Adicionar o componente abaixo dos gráficos existentes na página `/admin/tempo-real`.

### Passo 4: Adicionar versão compacta no AdminDashboard

Card menor no dashboard principal para visibilidade rápida.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/...` | Habilitar realtime em `test_answers` |
| `src/components/admin/LiveTestMonitor.tsx` | **CRIAR** - Componente principal |
| `src/components/admin/RealtimeDashboard.tsx` | Adicionar LiveTestMonitor |
| `src/components/admin/AdminDashboard.tsx` | Adicionar versão compacta (opcional) |

---

## Seção Técnica

### Query Principal

```sql
SELECT 
  ut.id,
  ut.user_id,
  ut.test_id,
  ut.status,
  ut.updated_at,
  p.full_name,
  t.name as test_name,
  (SELECT COUNT(*) FROM test_questions tq WHERE tq.test_id = ut.test_id) as total_questions,
  (SELECT COUNT(*) FROM test_answers ta WHERE ta.user_test_id = ut.id) as answered_questions
FROM user_tests ut
JOIN profiles p ON p.id = ut.user_id
JOIN tests t ON t.id = ut.test_id
WHERE ut.status = 'in_progress'
ORDER BY ut.updated_at DESC
LIMIT 10
```

### Realtime Subscriptions

```typescript
// Subscribe to user_tests changes
const userTestsChannel = supabase
  .channel("live-user-tests")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "user_tests" },
    () => fetchActiveTests()
  )
  .subscribe();

// Subscribe to test_answers (new answers)
const answersChannel = supabase
  .channel("live-test-answers")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "test_answers" },
    () => fetchActiveTests()
  )
  .subscribe();
```

### Indicador de Atividade

```typescript
const getActivityIndicator = (updatedAt: string) => {
  const minutesAgo = (Date.now() - new Date(updatedAt).getTime()) / 60000;
  
  if (minutesAgo < 2) {
    // Verde pulsante - ativo agora
    return <span className="animate-ping bg-green-500..." />;
  } else if (minutesAgo < 10) {
    // Amarelo - ativo recentemente
    return <span className="bg-yellow-500..." />;
  }
  // Cinza - inativo
  return <span className="bg-gray-300..." />;
};
```

---

## Resultado Esperado

Após implementação, o admin poderá:

1. Ver em tempo real quem está fazendo testes
2. Acompanhar o progresso de cada pessoa (ex: "Pergunta 31/36")
3. Identificar quem está ativo agora vs quem abandonou
4. Receber atualizações automáticas sem refresh

---

## Risco

**Baixo** - Funcionalidade aditiva que não afeta o fluxo dos testes. Usa padrões já existentes no Hiring.

