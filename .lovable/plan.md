
# Plano: Corrigir Fluxo de Signup com Verificação de Email

## Problema Identificado

A mensagem de sucesso após o cadastro diz **"Você já pode fazer login"**, mas na verdade o usuário precisa **confirmar o email primeiro**. Isso confunde os usuários e causa a experiência "Email not confirmed".

### Diagnóstico
- **Suami Lins**: `email_confirmed_at = null`, `last_sign_in_at = null`
- O email de confirmação foi enviado, mas a usuária não clicou no link
- A mensagem do toast é enganosa

### Não está relacionado ao sistema de idiomas
O GeoRedirect só afeta usuários fora do Brasil. A Suami está no Brasil, então o problema é exclusivamente a **UX do fluxo de confirmação de email**.

---

## Solução

### Parte 1: Corrigir Mensagens de Sucesso

Atualizar as mensagens em `src/pages/Auth.tsx` para informar sobre a necessidade de confirmar o email:

**De:**
```typescript
welcomeNew: language === 'en' 
  ? 'Welcome to Identity. You can now sign in.' 
  : 'Bem-vindo ao Identity. Você já pode fazer login.'
```

**Para:**
```typescript
welcomeNew: language === 'en' 
  ? 'Check your inbox and click the confirmation link to activate your account.' 
  : language === 'pt-pt'
    ? 'Verifique a sua caixa de entrada e clique no link de confirmação para ativar a conta.'
    : 'Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.'
```

### Parte 2: Remover Auto-Login Após Signup

O código atual tenta fazer login automático após o signup (linhas 274-304), mas isso falha porque o email não foi confirmado. Devemos:

1. **Remover a tentativa de auto-login**
2. **Redirecionar para uma página de "verifique seu email"** ou manter na tela de login com a mensagem correta

### Parte 3: Melhorar Tratamento do Erro "Email not confirmed"

Quando o usuário tentar fazer login sem ter confirmado o email, mostrar uma mensagem amigável:

**De:**
```
"Email not confirmed"
```

**Para:**
```
"Seu email ainda não foi confirmado. Verifique sua caixa de entrada e clique no link de confirmação. Deseja reenviar o email?"
```

---

## Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `src/pages/Auth.tsx` | Atualizar mensagens, remover auto-login, tratar erro de email não confirmado |

---

## Correção Imediata para Suami

Para a Suami poder entrar agora, tenho duas opções:

1. **Confirmar manualmente** o email no banco (ela entra imediatamente)
2. **Reenviar o email de confirmação** (ela precisa clicar no link)

Recomendo a opção 1 para resolver o caso urgente e depois implementar as correções no fluxo.

---

## Resultado Esperado

| Cenário | Antes | Depois |
|---------|-------|--------|
| Mensagem após cadastro | "Você já pode fazer login" (falso) | "Verifique seu email e clique no link de confirmação" (verdadeiro) |
| Login sem confirmar email | "Email not confirmed" (confuso) | Mensagem amigável + opção de reenviar |
| Auto-login após signup | Tenta e falha silenciosamente | Não tenta, aguarda confirmação |
