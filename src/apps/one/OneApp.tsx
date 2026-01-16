import { ReactNode } from 'react';

/**
 * Nello One | Identity - App Principal de Autoconhecimento
 * Subdomínio: identity.nello.one
 * Legacy: one.nello.one (redireciona automaticamente)
 * 
 * Descrição: Plataforma de autoconhecimento e identidade, 
 * com testes e perfis de essência.
 * 
 * Este é o app atual - não precisa de mudanças estruturais,
 * apenas wrapper para manter consistência no ecossistema.
 */

interface OneAppProps {
  children: ReactNode;
}

export default function OneApp({ children }: OneAppProps) {
  // Nello One usa as rotas existentes do App.tsx
  // Este componente é apenas um wrapper para organização
  return <>{children}</>;
}
