/**
 * @deprecated This module is deprecated. Use useOperatorWorkspace instead.
 * 
 * The professional_profiles table has been superseded by operator_workspaces.
 * This file now serves as a thin compatibility layer that delegates to useOperatorWorkspace.
 * All new code should use useOperatorWorkspace directly.
 * 
 * See: /docs/praxis/DOMAIN_MIGRATION.md
 */

import { ReactNode } from 'react';
import { useOperatorWorkspace, OperatorProvider } from './useOperatorWorkspace';

/**
 * @deprecated Use OperatorProvider instead
 */
export function PraxisAuthProvider({ children }: { children: ReactNode }) {
  // Simply pass through — OperatorProvider is the real provider now.
  // This wrapper exists only for backward compatibility during migration.
  return <>{children}</>;
}

/**
 * @deprecated Use useOperatorWorkspace instead
 * 
 * Returns a compatibility shim that maps operator workspace fields
 * to the old professionalProfile interface.
 */
export function usePraxisAuth() {
  const { workspace, isOperator, isLoading, needsOnboarding, createWorkspace, refetch } = useOperatorWorkspace();

  // Map workspace to legacy professionalProfile shape
  const professionalProfile = workspace ? {
    id: workspace.id,
    user_id: workspace.user_id,
    mode: 'praxis' as const,
    business_name: workspace.display_name,
    specialty: null,
    bio: null,
    avatar_url: null,
    website: null,
    phone: null,
    settings: workspace.settings,
    subscription_tier: 'free',
    subscription_status: 'active',
    trial_ends_at: null,
    current_clients: 0,
    max_clients: 100,
    created_at: workspace.created_at,
    updated_at: workspace.updated_at,
  } : null;

  const createProfile = async (data: { business_name?: string; specialty?: string; bio?: string }) => {
    const ws = await createWorkspace({ display_name: data.business_name || 'Minha Prática' });
    if (!ws) return null;
    return {
      id: ws.id,
      user_id: ws.user_id,
      mode: 'praxis' as const,
      business_name: ws.display_name,
      specialty: data.specialty || null,
      bio: data.bio || null,
      avatar_url: null,
      website: null,
      phone: null,
      settings: ws.settings,
      subscription_tier: 'free',
      subscription_status: 'active',
      trial_ends_at: null,
      current_clients: 0,
      max_clients: 100,
      created_at: ws.created_at,
      updated_at: ws.updated_at,
    };
  };

  return {
    professionalProfile,
    isProfessional: isOperator,
    isLoading,
    needsOnboarding,
    refetch,
    createProfile,
  };
}
