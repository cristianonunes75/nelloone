
# Plano: Excluir Páginas Legais do Modal de Consentimento

## Problema Identificado

O modal de consentimento LGPD está aparecendo em páginas públicas/institucionais como `/privacidade` e `/termos`. Isso cria um loop onde:

1. Usuario logado vê o modal de consentimento
2. Clica em "Termos de Uso" ou "Política de Privacidade" para ler
3. Abre a página legal, mas o modal aparece novamente ali
4. Usuario não consegue ler os documentos para poder aceitar

## Solução

Modificar o `ConsentGate` para ignorar páginas legais/públicas, permitindo que o usuário as acesse sem bloqueio.

## Implementação

### Arquivo a modificar
`src/components/ConsentGate.tsx`

### Alteração

Adicionar verificação de rota atual e lista de páginas excluídas:

```typescript
import { useLocation } from "react-router-dom";

// Páginas onde o modal NÃO deve aparecer
const EXCLUDED_PATHS = [
  '/termos', '/termos-de-servico', '/terms', '/terms-of-service',
  '/privacidade', '/politica-de-privacidade', '/privacy', '/privacy-policy',
  '/contato', '/contact',
  '/en/terms', '/en/privacy', '/en/contact',
  '/pt-pt/termos', '/pt-pt/privacidade', '/pt-pt/contato'
];

export function ConsentGate({ children }: ConsentGateProps) {
  const location = useLocation();
  
  // ... existing hooks ...
  
  // Não mostrar modal em páginas legais/públicas
  const isExcludedPath = EXCLUDED_PATHS.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );
  
  if (isExcludedPath) {
    return <>{children}</>;
  }
  
  // ... rest of logic ...
}
```

## Impacto

- Usuários podem acessar `/privacidade` e `/termos` sem bloqueio
- Podem ler os documentos antes de aceitar
- Modal continua aparecendo em todas as outras páginas protegidas
- Conformidade LGPD mantida (usuário ainda precisa aceitar para usar a plataforma)

## Validação

1. Acessar `/privacidade` logado - modal NÃO deve aparecer
2. Acessar `/termos` logado - modal NÃO deve aparecer
3. Acessar `/cliente` logado sem consentimento - modal DEVE aparecer
4. Links no modal abrem as páginas normalmente
