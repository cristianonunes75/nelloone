
# Plano: Corrigir Modal de Onboarding Travado em Mobile

## Problema Identificado

A usuária Janaína está presa na tela de onboarding porque o **botão "Continuar"** está fora da área visível da tela.

### Causa Raiz

O `DialogContent` do Radix UI usa posicionamento fixo centralizado SEM suporte a scroll interno:

```tsx
// dialog.tsx - linha 39
"fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ..."
// ❌ Falta: max-h-[...] overflow-y-auto
```

Quando o conteúdo do modal excede a altura da viewport (comum em celulares), o usuário não consegue fazer scroll para ver o botão.

### Evidência Visual

Na screenshot da Janaína, vemos:
- Título "Bem-vindo à Jornada Identity"
- Saudação personalizada
- 3 blocos de informação
- Texto "Você não precisa fazer tudo hoje..."
- **AUSENTE**: Botão "Continuar" (está abaixo da viewport)

---

## Solução Proposta

Adicionar suporte a scroll no modal de onboarding para garantir que o botão seja sempre acessível.

### Mudança 1: OnboardingModal.tsx

Adicionar classes de scroll ao DialogContent e reorganizar o layout:

```tsx
<DialogContent 
  className="sm:max-w-xl max-h-[90vh] overflow-y-auto flex flex-col" 
  onInteractOutside={(e) => e.preventDefault()}
>
```

### Mudança 2 (Alternativa Global): dialog.tsx

Se quisermos corrigir todos os modais do sistema, podemos adicionar as classes no componente base:

```tsx
// dialog.tsx - DialogContent
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] ...",
  className,
)}
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/cliente/OnboardingModal.tsx` | Adicionar `max-h-[90vh] overflow-y-auto` ao DialogContent |

---

## Implementação Detalhada

### OnboardingModal.tsx - Linha 111

**Antes:**
```tsx
<DialogContent className="sm:max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
```

**Depois:**
```tsx
<DialogContent 
  className="sm:max-w-xl max-h-[90vh] overflow-y-auto" 
  onInteractOutside={(e) => e.preventDefault()}
>
```

---

## Seção Técnica

### Comportamento Esperado Após Correção

| Situação | Antes | Depois |
|----------|-------|--------|
| Celular pequeno (ex: 360x640) | Botão cortado, sem scroll | Scroll vertical funciona |
| Celular médio (ex: 375x812) | Botão parcialmente visível | Scroll se necessário |
| Desktop | Funciona normalmente | Sem mudança |

### CSS Aplicado

```css
max-h-[90vh]    /* Limita altura a 90% da viewport */
overflow-y-auto /* Permite scroll vertical quando necessário */
```

---

## Resultado Esperado

Após a correção:
1. Janaína poderá fazer scroll para ver o botão "Continuar"
2. O modal nunca excederá 90% da altura da tela
3. Usuários em qualquer tamanho de tela conseguirão completar o onboarding

---

## Risco

**Muito baixo** - Apenas adiciona scroll onde necessário. Não afeta aparência em telas grandes.
