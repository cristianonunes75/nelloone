import { useMemo } from 'react';
import { useBusinessAuth } from './useBusinessAuth';
import { useBusinessSubscription, BusinessSubscription, BUSINESS_TIERS } from './useBusinessSubscription';

export type EnforcementStatus = 
  | 'active'           // Full access
  | 'trial'            // Trial active
  | 'trial_expired'    // Trial ended, no subscription
  | 'suspended'        // Payment failed or manually suspended
  | 'over_limit'       // Exceeded collaborator limit
  | 'cancelled';       // Subscription cancelled

export interface EnforcementState {
  // Core status
  status: EnforcementStatus;
  isBlocked: boolean;
  isLoading: boolean;
  
  // Trial info
  isInTrial: boolean;
  isTrialExpired: boolean;
  trialDaysRemaining: number | null;
  trialEndsAt: string | null;
  
  // Limits
  isOverLimit: boolean;
  currentCollaborators: number;
  maxCollaborators: number;
  remainingSlots: number;
  
  // Subscription
  subscription: BusinessSubscription | null;
  currentTier: string;
  tierName: string;
  
  // Permissions
  canInviteCollaborators: boolean;
  canViewInsights: boolean;
  canAccessDashboard: boolean;
  canCreateTeams: boolean;
  
  // Actions
  blockReason: string | null;
  upgradeRequired: boolean;
  showUpgradeCTA: boolean;
}

const TRIAL_DURATION_DAYS = 14;

/**
 * Central enforcement hook for Nello One Business
 * Single source of truth for all access control decisions
 */
export function useBusinessEnforcement(): EnforcementState {
  const { company, isCompanyAdmin, isSuperAdmin, isLoading: authLoading } = useBusinessAuth();
  const { subscription, isLoading: subLoading } = useBusinessSubscription();
  
  return useMemo(() => {
    const isLoading = authLoading || subLoading;
    
    // Default state for loading or no company
    if (isLoading || !company) {
      return {
        status: 'trial' as EnforcementStatus,
        isBlocked: false,
        isLoading,
        isInTrial: false,
        isTrialExpired: false,
        trialDaysRemaining: null,
        trialEndsAt: null,
        isOverLimit: false,
        currentCollaborators: 0,
        maxCollaborators: 10,
        remainingSlots: 10,
        subscription: null,
        currentTier: 'trial',
        tierName: 'Trial',
        canInviteCollaborators: true,
        canViewInsights: true,
        canAccessDashboard: true,
        canCreateTeams: true,
        blockReason: null,
        upgradeRequired: false,
        showUpgradeCTA: false,
      };
    }

    // Super admins bypass all restrictions
    if (isSuperAdmin) {
      return {
        status: 'active' as EnforcementStatus,
        isBlocked: false,
        isLoading: false,
        isInTrial: false,
        isTrialExpired: false,
        trialDaysRemaining: null,
        trialEndsAt: null,
        isOverLimit: false,
        currentCollaborators: subscription?.currentCollaborators || 0,
        maxCollaborators: 999,
        remainingSlots: 999,
        subscription,
        currentTier: 'enterprise',
        tierName: 'Super Admin',
        canInviteCollaborators: true,
        canViewInsights: true,
        canAccessDashboard: true,
        canCreateTeams: true,
        blockReason: null,
        upgradeRequired: false,
        showUpgradeCTA: false,
      };
    }

    const currentCollaborators = subscription?.currentCollaborators || 0;
    const maxCollaborators = subscription?.maxCollaborators || BUSINESS_TIERS.trial.maxCollaborators;
    const remainingSlots = Math.max(0, maxCollaborators - currentCollaborators);
    const isOverLimit = currentCollaborators >= maxCollaborators;

    // Determine trial status
    const subscriptionStatus = subscription?.status || 'trial';
    const subscriptionEnd = subscription?.subscriptionEnd;
    
    let isInTrial = subscriptionStatus === 'trial';
    let isTrialExpired = false;
    let trialDaysRemaining: number | null = null;
    let trialEndsAt: string | null = null;
    
    if (isInTrial && subscriptionEnd) {
      const endDate = new Date(subscriptionEnd);
      const now = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      trialDaysRemaining = Math.max(0, daysRemaining);
      trialEndsAt = subscriptionEnd;
      
      if (daysRemaining < 0) {
        isTrialExpired = true;
        isInTrial = false;
      }
    } else if (isInTrial && !subscriptionEnd) {
      // If in trial but no end date, assume 14 days from now (new trial)
      trialDaysRemaining = TRIAL_DURATION_DAYS;
    }

    // Determine enforcement status
    let status: EnforcementStatus = 'active';
    let blockReason: string | null = null;
    
    if (subscriptionStatus === 'cancelled') {
      status = 'cancelled';
      blockReason = 'Assinatura cancelada. Reative para continuar usando o Nello Business.';
    } else if (subscriptionStatus === 'past_due') {
      status = 'suspended';
      blockReason = 'Pagamento pendente. Atualize seus dados de pagamento para continuar.';
    } else if (isTrialExpired) {
      status = 'trial_expired';
      blockReason = 'Seu período de trial expirou. Escolha um plano para continuar.';
    } else if (isOverLimit) {
      status = 'over_limit';
      blockReason = `Limite de ${maxCollaborators} colaboradores atingido. Faça upgrade para adicionar mais.`;
    } else if (isInTrial) {
      status = 'trial';
    } else if (subscriptionStatus === 'active') {
      status = 'active';
    }

    // Determine blocked state (affects dashboard access)
    const isBlocked = ['trial_expired', 'suspended', 'cancelled'].includes(status);
    
    // Calculate permissions
    const canInviteCollaborators = !isBlocked && !isOverLimit;
    const canViewInsights = !isBlocked; // Insights blocked when trial expired
    const canAccessDashboard = !isBlocked; // Dashboard blocked when trial expired
    const canCreateTeams = !isBlocked && !isOverLimit;
    
    // Upgrade messaging
    const upgradeRequired = isBlocked || status === 'trial';
    const showUpgradeCTA = upgradeRequired || isOverLimit || (trialDaysRemaining !== null && trialDaysRemaining <= 3);

    const tier = subscription?.tier || 'trial';
    const tierInfo = BUSINESS_TIERS[tier as keyof typeof BUSINESS_TIERS];
    
    return {
      status,
      isBlocked,
      isLoading: false,
      isInTrial,
      isTrialExpired,
      trialDaysRemaining,
      trialEndsAt,
      isOverLimit,
      currentCollaborators,
      maxCollaborators,
      remainingSlots,
      subscription,
      currentTier: tier,
      tierName: tierInfo?.name || 'Trial',
      canInviteCollaborators,
      canViewInsights,
      canAccessDashboard,
      canCreateTeams,
      blockReason,
      upgradeRequired,
      showUpgradeCTA,
    };
  }, [authLoading, subLoading, company, isSuperAdmin, subscription]);
}
