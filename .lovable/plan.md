
# Plano: Implementar Verificação de Senhas Vazadas (HaveIBeenPwned)

## Visão Geral
Adicionar uma camada de segurança que verifica se a senha escolhida pelo usuário aparece em vazamentos de dados conhecidos, bloqueando o cadastro caso a senha esteja comprometida.

---

## Como Funciona

A verificação usa o protocolo **k-Anonymity** da API HaveIBeenPwned:
1. A senha é convertida em hash SHA-1
2. Apenas os **5 primeiros caracteres** do hash são enviados à API
3. A API retorna uma lista de sufixos de hashes comprometidos
4. A verificação completa acontece localmente (a senha nunca é exposta)

---

## Componentes a Implementar

### 1. Backend Function
Nova Edge Function `check-password-breach` que:
- Recebe a senha do cliente
- Gera o hash SHA-1
- Consulta a API HaveIBeenPwned
- Retorna se a senha está comprometida

### 2. Hook de Verificação
Novo hook `usePasswordBreachCheck` que:
- Debounce da verificação (evita excesso de chamadas)
- Mostra estado de carregamento
- Retorna resultado da verificação

### 3. Integração nas Telas de Cadastro
Atualizar os 5 formulários de cadastro existentes:
- `src/pages/Auth.tsx` (Nello One principal)
- `src/apps/flow/pages/FlowAuth.tsx`
- `src/apps/life/pages/LifeAuth.tsx`
- `src/apps/business/pages/PraxisAuth.tsx`
- `src/apps/business/pages/BusinessAuth.tsx`

---

## Experiência do Usuário

```text
┌─────────────────────────────────────────┐
│  Senha: ••••••••                   👁   │
├─────────────────────────────────────────┤
│  [███████░░░] Média                     │  ← Indicador existente
│                                         │
│  ⚠️ Esta senha foi encontrada em um    │  ← Novo aviso
│     vazamento de dados. Por sua         │
│     segurança, escolha outra senha.     │
└─────────────────────────────────────────┘
```

- Verificação acontece após ~500ms de digitação
- Botão de cadastro fica desabilitado se senha comprometida
- Mensagem clara e amigável em português

---

## Detalhes Técnicos

### Edge Function: `check-password-breach`

```typescript
// Fluxo simplificado:
1. Recebe { password: string }
2. Gera SHA-1 hash da senha
3. Extrai prefix (5 chars) e suffix (resto)
4. GET https://api.pwnedpasswords.com/range/{prefix}
5. Verifica se suffix está na resposta
6. Retorna { breached: boolean, count?: number }
```

### Hook: `usePasswordBreachCheck`

```typescript
// Uso:
const { isBreached, isChecking, checkPassword } = usePasswordBreachCheck();

// Retorna:
- isBreached: boolean | null
- isChecking: boolean
- checkPassword: (password: string) => void
```

### Modificações nos Formulários

1. Importar o novo hook
2. Chamar `checkPassword(password)` no `onChange`
3. Exibir aviso quando `isBreached === true`
4. Desabilitar submit quando senha comprometida

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/check-password-breach/index.ts` | Criar |
| `supabase/config.toml` | Adicionar config |
| `src/hooks/usePasswordBreachCheck.ts` | Criar |
| `src/components/PasswordBreachWarning.tsx` | Criar |
| `src/pages/Auth.tsx` | Modificar |
| `src/apps/flow/pages/FlowAuth.tsx` | Modificar |
| `src/apps/life/pages/LifeAuth.tsx` | Modificar |
| `src/apps/business/pages/PraxisAuth.tsx` | Modificar |
| `src/apps/business/pages/BusinessAuth.tsx` | Modificar |

---

## Considerações de Segurança

- A senha **nunca** é enviada em texto claro à API externa
- Hash SHA-1 parcial protege a privacidade (k-Anonymity)
- Verificação server-side evita bypass pelo cliente
- Rate limiting natural da API (sem necessidade de configurar)
