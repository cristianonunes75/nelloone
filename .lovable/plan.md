

# Login com Google no Identity

## Resumo
Adicionar o botao "Entrar com Google" apenas na tela de autenticacao do Identity (a tela principal de login em `src/pages/Auth.tsx`). O Discernir mantem apenas email/senha.

## O que muda
- Na tela de login do Identity, aparece um botao "Entrar com Google"
- Separador visual "ou" entre Google e email/senha
- Usuario clica, escolhe conta Google, entra direto
- Primeira vez: conta criada automaticamente com perfil e role "cliente"

## Etapas tecnicas

### 1. Configurar modulo de autenticacao social
- Usar a ferramenta do Lovable Cloud para gerar o modulo Google OAuth em `src/integrations/lovable/`

### 2. Atualizar `src/pages/Auth.tsx`
- Importar `lovable` do modulo gerado
- Adicionar botao "Entrar com Google" com icone
- Chamar `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`
- Separador visual "ou" entre as opcoes
- Manter o design atual da pagina

### 3. Nenhuma alteracao no Discernir
- `DiscernirAuth.tsx` permanece como esta (apenas email/senha)

### 4. Nenhuma alteracao no banco
- O trigger `handle_new_user` ja cria perfil e role automaticamente

