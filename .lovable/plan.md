

# Recuperacao de Senha via Resend

## Problema
Os emails de recuperacao de senha usam o sistema de email nativo do backend, que tem limitacoes de entrega. O Resend ja esta configurado no projeto com o dominio `nello.one` verificado, mas nao esta sendo usado para este fluxo.

## Solucao
Criar uma edge function que envia o email de recuperacao de senha via Resend, e atualizar a tela de "Esqueci minha senha" para usar essa funcao em vez do metodo nativo.

## O que muda para o usuario
- O email de recuperacao chega de `noreply@nello.one` (mesmo remetente dos outros emails do sistema)
- Entrega muito mais confiavel via Resend
- Visual do email padronizado com a marca NELLO ONE

## Etapas tecnicas

### 1. Criar edge function `send-password-reset`
- Recebe o email do usuario
- Usa a Admin API do backend para gerar o link de recuperacao (via `generateLink`)
- Envia o email com o link via Resend, usando o template visual da marca
- Remetente: `NELLO ONE <noreply@nello.one>`

### 2. Atualizar a tela de recuperacao de senha
- Arquivo: `src/pages/ResetPassword.tsx`
- Em vez de chamar `supabase.auth.resetPasswordForEmail()`, chamar a edge function `send-password-reset`
- Manter toda a interface visual atual (indicador de forca de senha, etc.)

### 3. Nenhuma alteracao no banco de dados
- Nao precisa de migracao, tudo ja esta configurado

