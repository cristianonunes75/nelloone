
# Plano: Padronização de Compatibilidade Mobile

## Problema Identificado

Vários bugs estão surgindo em navegadores móveis (como o da Janaína onde o botão ficou cortado) devido a **padrões inconsistentes** no código:

1. **Modais sem scroll**: `DialogContent` e `AlertDialogContent` não têm `max-h` nem `overflow-y-auto` por padrão
2. **Altura de viewport inconsistente**: Uso de `100vh` que não funciona bem em mobile (barra de navegação do browser ocupa espaço)
3. **Falta de estilos de touch**: Sem otimizações CSS para touch em dispositivos móveis
4. **72+ arquivos** usam modais potencialmente problemáticos

---

## Solução Proposta

### Abordagem: Correção nos Componentes Base

Em vez de corrigir cada componente individualmente, vamos adicionar padrões mobile-safe nos componentes UI base.

---

## Mudanças Propostas

### 1. Componente Dialog Base

Adicionar scroll automático quando necessário:

```tsx
// src/components/ui/dialog.tsx - DialogContent
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[85vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] ...",
  className,
)}
```

### 2. Componente AlertDialog Base

Mesma correção:

```tsx
// src/components/ui/alert-dialog.tsx - AlertDialogContent
className={cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[85vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] ...",
  className,
)}
```

### 3. Estilos Globais Mobile-First

Adicionar ao `index.css`:

```css
@layer base {
  /* Mobile viewport fix - Evita problemas com barra de navegação */
  html {
    height: -webkit-fill-available;
  }
  
  body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
  
  /* Melhor scroll em iOS */
  * {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Remove tap highlight em mobile */
  button, a, [role="button"] {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Previne zoom indesejado em inputs no iOS */
  input, select, textarea {
    font-size: 16px !important;
  }
}

@layer utilities {
  /* Safe viewport height que respeita barras de navegação */
  .h-safe-screen {
    height: 100vh;
    height: 100dvh;
  }
  
  .min-h-safe-screen {
    min-height: 100vh;
    min-height: 100dvh;
  }
}
```

### 4. Hook `use-mobile` Aprimorado

Adicionar detecção de touch e orientação:

```tsx
// src/hooks/use-mobile.tsx
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Novo: detecta se é dispositivo touch
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);
  
  React.useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  return isTouch;
}

// Novo: viewport seguro que atualiza com resize
export function useSafeViewportHeight() {
  const [height, setHeight] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  
  React.useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);
  
  return height;
}
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/ui/dialog.tsx` | Adicionar `max-h-[85vh] overflow-y-auto` |
| `src/components/ui/alert-dialog.tsx` | Adicionar `max-h-[85vh] overflow-y-auto` |
| `src/index.css` | Adicionar estilos mobile-first globais |
| `src/hooks/use-mobile.tsx` | Adicionar hooks auxiliares |

---

## Seção Técnica

### Por que 85vh e não 90vh ou 100vh?

| Valor | Problema |
|-------|----------|
| `100vh` | Em mobile, inclui a barra de navegação do browser, causando scroll indesejado |
| `90vh` | Funciona na maioria, mas pode cortar em telas muito pequenas (320px) |
| `85vh` | Margem segura que funciona em todos os dispositivos, deixando espaço para barras do sistema |

### Por que `dvh` (dynamic viewport height)?

```css
height: 100dvh; /* Novo padrão CSS que atualiza quando a barra do browser some/aparece */
```

O `dvh` é suportado em browsers modernos e resolve o problema histórico do `100vh` em mobile.

### Compatibilidade de Browsers

| Browser | `dvh` suportado |
|---------|-----------------|
| Chrome/Android | 108+ |
| Safari/iOS | 15.4+ |
| Samsung Internet | 19+ |
| Firefox | 101+ |

Para browsers antigos, usamos fallback:

```css
min-height: 100vh;          /* Fallback */
min-height: 100dvh;         /* Browsers modernos */
```

---

## Impacto

### Correções Automáticas

Todos os 72+ componentes que usam `Dialog` ou `AlertDialog` passarão a ter scroll automático quando o conteúdo exceder 85% da viewport.

### Comportamento Esperado

| Situação | Antes | Depois |
|----------|-------|--------|
| Modal com muito conteúdo em mobile | Botão cortado, sem scroll | Scroll vertical funciona |
| Teclado virtual aberto | Layout quebra | Layout se adapta |
| Orientação landscape em celular | Conteúdo cortado | Scroll disponível |

---

## Risco

**Baixo** - São melhorias aditivas que não quebram funcionalidade existente. O comportamento em desktop permanece inalterado.

---

## Próximos Passos (Opcionais)

Após implementar estas correções base, podemos considerar:

1. **Drawer Mobile-First**: Usar `Drawer` (vaul) em vez de `Dialog` automaticamente em mobile para melhor UX
2. **Auditoria de `min-h-screen`**: Substituir por `min-h-safe-screen` nos 73 arquivos identificados
3. **Testes em dispositivos reais**: Validar em Samsung Internet, Safari iOS, Chrome Android

