
# Plano: Corrigir Erro "Erro ao criar cupom"

## Problema Identificado

O erro ao criar cupom ocorre porque as **Edge Functions de cupons** têm headers CORS incompletos. O cliente Supabase moderno envia headers adicionais que não estão sendo aceitos pelo servidor, fazendo a requisição falhar antes mesmo de chegar à função.

### Headers Atuais (Incompletos)
```javascript
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
```

### Headers Necessários
```javascript
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version"
```

## Arquivos a Corrigir

### 1. `supabase/functions/create-stripe-coupon/index.ts`
- Atualizar a constante `corsHeaders` (linha 5-8)

### 2. `supabase/functions/list-stripe-coupons/index.ts`  
- Atualizar a constante `corsHeaders` (linha 4-7)

### 3. `supabase/functions/update-stripe-coupon/index.ts`
- Atualizar a constante `corsHeaders` (linha 5-8)

## Mudança Específica

Em cada arquivo, substituir:
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

Por:
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

## Resultado Esperado

Após a correção, a criação de cupons funcionará normalmente, pois as requisições do cliente Supabase serão aceitas corretamente pelo servidor.
