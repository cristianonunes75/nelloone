
# Plano: Correção do Erro CORS na Edge Function create-checkout

## Problema Identificado

O erro "Failed to send a request to the Edge Function" que a Saula está enfrentando é causado por headers CORS incompletos na Edge Function `create-checkout`.

## Causa Raiz

O cliente Supabase JS envia headers adicionais que não estão na lista de headers permitidos da Edge Function:

**Atual (linha 7):**
```javascript
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
```

**Headers que o cliente envia mas não estão permitidos:**
- `x-supabase-client-platform`
- `x-supabase-client-platform-version`
- `x-supabase-client-runtime`
- `x-supabase-client-runtime-version`

Quando o navegador faz a requisição preflight (OPTIONS), o servidor responde sem permitir esses headers, e o navegador bloqueia a requisição.

## Solução

Atualizar os headers CORS na Edge Function `create-checkout` para incluir todos os headers necessários.

## Implementação

### Arquivo a modificar
`supabase/functions/create-checkout/index.ts`

### Alteração (linhas 5-8)

**De:**
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

**Para:**
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

## Impacto

- Correção imediata do erro para todos os usuários
- Não há breaking changes
- Compatibilidade total com versões atuais do Supabase JS Client

## Validação

Após a correção, a Saula (e outros usuários) poderão:
1. Clicar em "Desbloquear Jornada Completa"
2. Ser redirecionados normalmente para o checkout do Stripe
3. Completar a compra sem erros
