

## Problemas Identificados

### 1. Sidebar - Seção inferior confusa
A imagem mostra o `CompanySwitcher` e o `AdminAppSwitcher` empilhados na parte inferior do sidebar, criando um visual poluído. O dropdown do CompanySwitcher aparece cortado na parte de baixo.

### 2. Refresh automático persistente
O `useVersionCheck` já ignora `lovable.app`, mas o **Service Worker (PWA)** com `immediate: true` no `useRegisterSW` continua registrando e verificando atualizações automaticamente. Quando o SW detecta uma nova versão, ele pode provocar reload via `clients.claim()` ou via o prompt de atualização. Além disso, o `useRegisterSW` roda um `setInterval` de 60 minutos chamando `r.update()` que pode acionar reloads.

---

## Plano

### Corrigir Sidebar (BusinessLayout.tsx)

1. Mover o `CompanySwitcher` para dentro do **header do sidebar** (junto ao logo/nome da empresa), onde faz mais sentido contextualmente
2. Remover o `AdminAppSwitcher` da parte inferior do sidebar -- mantê-lo apenas no header mobile
3. Limpar a seção inferior para conter apenas: Configurações, Sair e Recolher
4. Garantir que no modo `collapsed` a seção inferior mostre apenas ícones

### Eliminar refresh no domínio lovable.app (usePWAInstall.tsx)

1. Adicionar verificação `isDevelopment()` (mesma lógica do `useVersionCheck`) dentro do `usePWAInstall` para **não registrar o Service Worker** em ambientes lovable.app/preview
2. Isso impede que o SW fique verificando atualizações e provocando reloads nesse ambiente

### Arquivos afetados
- `src/apps/business/components/BusinessLayout.tsx` -- reorganizar sidebar
- `src/hooks/usePWAInstall.tsx` -- desabilitar SW em ambientes de preview/lovable.app

