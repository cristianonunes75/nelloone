

## Diagnóstico

O refresh automático durante o uso é causado pelo hook `useVersionCheck` em `src/hooks/useVersionCheck.tsx`. Ele verifica periodicamente se o bundle JS mudou e, quando detecta diferença, força um `window.location.reload()`.

No ambiente de preview da Lovable (`lovableproject.com` / `lovable.app`), ele **deveria** estar desativado pela função `isDevelopment()`, mas o domínio publicado (`nelloone.lovable.app`) **não** está na lista de exceções — então o reload ocorre lá.

Além disso, a cada deploy do Lovable o hash do bundle muda, disparando o reload mesmo durante uso ativo.

## Plano

**Arquivo**: `src/hooks/useVersionCheck.tsx`

1. Adicionar `lovable.app` à lista de domínios ignorados na função `isDevelopment()` (linha 11), para que o version check não rode no ambiente publicado da Lovable.

2. Como medida extra de segurança, aumentar o `MIN_TIME_BETWEEN_RELOADS` de 5 minutos para 30 minutos e o `INITIAL_CHECK_DELAY` de 1 minuto para 5 minutos — evitando reloads frequentes mesmo em produção real (domínio customizado).

Isso resolve o problema sem remover a funcionalidade para quando o app estiver em domínio próprio (nello.one).

