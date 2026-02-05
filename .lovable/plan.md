
# Plano: Corrigir Erro CORS nas Edge Functions de Avaliação

## Problema Identificado

O erro **"Failed to send a request to the Edge Function"** ocorre porque os headers CORS nas Edge Functions `business-send-job-assessment` e `business-resend-assessment` estão incompletos.

O Supabase client JavaScript envia headers adicionais que não estão na lista permitida:
- `x-supabase-client-platform`
- `x-supabase-client-platform-version`
- `x-supabase-client-runtime`
- `x-supabase-client-runtime-version`

Quando o navegador faz a requisição preflight (OPTIONS), o servidor recusa esses headers e a requisição principal falha.

## Solução

Atualizar os `corsHeaders` em ambas as Edge Functions para incluir todos os headers necessários.

## Arquivos a Modificar

### 1. `supabase/functions/business-send-job-assessment/index.ts`

**Linha 7-10** - Atualizar corsHeaders:

```typescript
// DE:
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PARA:
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

### 2. `supabase/functions/business-resend-assessment/index.ts`

**Linha 7-10** - Mesma alteração:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

## Impacto

- O botão "Avaliação Comportamental" funcionará normalmente
- O reenvio de avaliações também funcionará
- Emails de convite serão enviados aos candidatos
- Nenhum impacto em outras funcionalidades

## Validação

1. Clicar em "Avaliação Comportamental" em um candidato
2. Verificar que não aparece erro
3. Confirmar que candidato recebeu email com link
