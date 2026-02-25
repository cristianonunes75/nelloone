

# Adicionar botão de Login na Landing Page para usuários que retornam

## Problema

Quando um usuário que já fez a Leitura Inicial retorna ao site, ele vê apenas o botão "Fazer minha Leitura Inicial" na navegação. Não há nenhum botão de login visível, forçando-o a refazer a leitura ou procurar manualmente a página de autenticação.

## Solução

Adicionar um botão/link discreto de login ao lado do CTA principal na navegação (NavSection), tanto no desktop quanto no mobile.

## Mudanças

### Arquivo: `src/components/landing/v2/NavSection.tsx`

**Desktop (linha ~166-177):** Onde atualmente só aparece o botão dourado "Fazer minha Leitura Inicial" para visitantes não logados, adicionar um botão ghost de login antes dele:

```text
[Entrar]  [Fazer minha Leitura Inicial]
```

- Botão "Entrar" com estilo `variant="ghost"` e ícone `LogIn`, discreto
- Redireciona para `/auth?redirect=/dashboard`
- Mantém o CTA principal dourado como ação prioritária

**Mobile (linha ~258-268):** No menu mobile, adicionar um botão de login acima do CTA principal:

- Botão outline "Já tenho conta" com ícone `LogIn`
- Mesmo redirecionamento para `/auth?redirect=/dashboard`

### Detalhes visuais

- O botão de login será secundário (ghost/outline) para não competir visualmente com o CTA dourado
- Texto em português: "Entrar" (desktop) / "Já tenho conta" (mobile)
- Texto em inglês: "Sign In" (desktop) / "I have an account" (mobile)
- Mantém a hierarquia visual: o CTA dourado continua sendo a ação principal

### Nenhuma outra mudança necessária

A rota `/auth` já existe e aceita o parâmetro `?redirect=`, então o fluxo de redirecionamento ao dashboard após login já funciona.
