
# Correção: Link de compartilhamento dos testes

## Problema
Ao concluir um teste e compartilhar via WhatsApp, o link enviado é `https://nello.one/` (landing institucional) em vez de `https://identity.nello.one` (a plataforma Identity onde os testes estão).

## Solução
Corrigir os links de compartilhamento em **2 arquivos**:

### 1. `src/pages/TestResults.tsx` (linha ~1211-1213)
- Trocar `nello.one` por `identity.nello.one` no texto e na URL do share

### 2. `src/pages/Cliente.tsx` (linha ~455-457)
- Trocar `nello.one` por `identity.nello.one` no texto e na URL do share

### Resultado
As mensagens de compartilhamento passarão a mostrar:
- Texto: "Descubra sua essência em identity.nello.one"
- URL: `https://identity.nello.one`
