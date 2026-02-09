

# Desabilitar Ingles e Portugues de Portugal Temporariamente

## O que sera feito

Alterar duas flags no arquivo `src/components/LanguageRoute.tsx` de `true` para `false`. O sistema ja possui essa logica implementada -- quando desabilitadas, qualquer acesso a rotas `/en/*` ou `/pt-pt/*` e automaticamente redirecionado para a versao PT-BR (`/`).

Alem disso, desabilitar o GeoRedirect para que visitantes internacionais nao sejam redirecionados para rotas que serao bloqueadas.

## Arquivos a modificar

### 1. `src/components/LanguageRoute.tsx`
- Linha 7: `ENGLISH_VERSION_ENABLED = true` para `false`
- Linha 8: `PT_PT_VERSION_ENABLED = true` para `false`

### 2. `src/components/GeoRedirect.tsx`
- Adicionar um retorno antecipado (`return null`) no inicio do componente, para que nenhum visitante seja redirecionado para `/en` ou `/pt-pt` enquanto essas versoes estiverem desabilitadas.

### Resultado
- Qualquer URL com `/en/` ou `/pt-pt/` redireciona automaticamente para a versao brasileira
- Visitantes internacionais permanecem na versao PT-BR
- Para reativar no futuro, basta voltar as flags para `true` e remover o retorno antecipado do GeoRedirect

