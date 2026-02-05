
# Plano: Corrigir Botão Cortado no Modal de Consentimento

## Problema Identificado

O botão "Aceitar e Continuar" existe no código mas está sendo **cortado visualmente** no modal. O DialogContent está limitando a altura e escondendo o botão.

## Causa Raiz

O componente `DialogContent` pode estar com:
1. Altura máxima (`max-height`) muito restritiva
2. `overflow: hidden` cortando o conteúdo
3. O botão está fora do container com scroll

## Solução

Ajustar o CSS do `DialogContent` para garantir que todo o conteúdo seja visível, incluindo o botão.

## Implementação

### Arquivo a modificar
`src/components/ConsentModal.tsx`

### Alteração

Adicionar classes CSS para garantir scroll interno e visibilidade completa:

```tsx
// Linha 82-86 - Adicionar overflow-y-auto e max-h-[90vh]
<DialogContent 
  className="sm:max-w-md [&>button]:hidden max-h-[90vh] overflow-y-auto"
  onPointerDownOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()}
>
```

E também envolver o conteúdo em um container com flex para garantir que o botão sempre apareça:

```tsx
// Estrutura ajustada
<DialogContent className="sm:max-w-md [&>button]:hidden flex flex-col max-h-[90vh]">
  <DialogHeader>...</DialogHeader>
  
  <div className="flex-1 overflow-y-auto space-y-4 py-4">
    {/* checkboxes e info text */}
  </div>
  
  {/* Botão sempre visível no final */}
  <div className="pt-4 border-t mt-auto">
    <Button ... />
  </div>
</DialogContent>
```

## Impacto

- Botão "Aceitar e Continuar" sempre visível
- Em telas pequenas, o conteúdo terá scroll mas o botão permanece fixo
- Usuários conseguem completar o aceite dos termos
