
# Plano: Corrigir Erro "Email not confirmed" e Atualizar CORS

## Problema Principal Identificado

A usuária (Suami Lins) clicou no link de confirmação de e-mail, mas o **e-mail nunca foi confirmado** no banco de dados (`email_confirmed_at = null`).

**Causa raiz:** O `GeoRedirect` está redirecionando para `/en` **sem preservar o hash da URL** que contém o token de autenticação.

Quando o usuário clica no link de confirmação, o Supabase envia para:
```
https://identity.nello.one/#access_token=xxxxx&type=signup&token_hash=xxxxx
```

Mas o `GeoRedirect` detecta que a usuária está nos EUA e faz:
```javascript
navigate("/en", { replace: true });  // ❌ PERDE O HASH!
```

O token de confirmação é perdido e o e-mail nunca é verificado.

---

## Solução

### Parte 1: Preservar Hash nos Redirecionamentos

Modificar `src/components/GeoRedirect.tsx` para:

1. **Não redirecionar se houver hash na URL** (indica callback de autenticação)
2. **Se redirecionar, preservar search e hash** usando o objeto de navegação completo

Mudança específica (linhas 88-97 e 119-126):
```typescript
// ANTES:
navigate("/en", { replace: true });

// DEPOIS:
navigate({
  pathname: "/en",
  search: location.search,
  hash: location.hash
}, { replace: true });
```

E adicionar verificação no início:
```typescript
// NÃO redirecionar se URL tem hash (callback de autenticação)
if (location.hash) {
  setHasChecked(true);
  return;
}
```

---

### Parte 2: Atualizar CORS nas Edge Functions Críticas

As seguintes funções ainda têm headers CORS desatualizados e podem falhar com clientes Supabase modernos:

| Função | Status CORS |
|--------|-------------|
| `verify-checkout` | ❌ Desatualizado |
| `send-email` | ❌ Desatualizado |
| `nello-agent` | ❌ Desatualizado |
| `create-checkout` | Verificar |
| `check-password-breach` | ✅ Atualizado |

Cada função precisará ter os headers atualizados para:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

---

### Parte 3: Correção Imediata para Usuária

Após as correções serem implementadas, será necessário:
1. **Reenviar o e-mail de confirmação** para `suamilins@gmail.com`
2. Ou **confirmar manualmente** o e-mail no banco de dados

---

## Arquivos a Modificar

### 1. `src/components/GeoRedirect.tsx`
- Adicionar verificação de hash no início
- Preservar hash/search em todos os `navigate()`

### 2. Edge Functions com CORS desatualizado:
- `supabase/functions/verify-checkout/index.ts`
- `supabase/functions/send-email/index.ts`
- `supabase/functions/nello-agent/index.ts`
- `supabase/functions/create-checkout/index.ts` (verificar)

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Confirmação de e-mail (EUA) | Token perdido, e-mail não confirmado | Token preservado, e-mail confirmado ✅ |
| Recuperação de senha (EUA) | Redirect falha | Funciona normalmente ✅ |
| Login com Google (Europa) | Pode perder tokens | Tokens preservados ✅ |
| Novas funções do cliente | CORS bloqueado | Requisições bem-sucedidas ✅ |

---

## Correção Manual Necessária

Para a usuária Suami Lins que já está afetada, após implementar as correções:

1. Opção A: Reenviar link de confirmação (ela precisará clicar novamente)
2. Opção B: Confirmar e-mail manualmente via SQL (mais rápido)

```sql
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'suamilins@gmail.com';
```
