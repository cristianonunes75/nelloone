import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessAuth, BusinessRole } from '../hooks/useBusinessAuth';
import { useCrossAppAuth } from '@/hooks/useCrossAppAuth';
import { useTrialEnforcement } from '../hooks/useTrialEnforcement';
import { Loader2 } from 'lucide-react';

interface BusinessProtectedRouteProps {
  children: ReactNode;
  requiredRole?: BusinessRole | 'any';
  enforceTrial?: boolean;
}

// Routes that require active subscription / trial
const PAYWALL_ROUTES = ['/dashboard', '/jobs', '/hiring', '/candidates', '/team', '/settings', '/billing'];

export function BusinessProtectedRoute({ 
  children, 
  requiredRole = 'any',
  enforceTrial = true,
}: BusinessProtectedRouteProps) {
  const { user, userRoles, isLoading: authLoading } = useAuth();
  const { 
    companyUser, 
    businessRole, 
    isLoading: businessLoading,
    needsConsent,
    needsOnboarding,
    hasCompany
  } = useBusinessAuth();
  const location = useLocation();
  
  // Handle cross-app authentication tokens (from AdminAppSwitcher)
  const { isPending: crossAppPending } = useCrossAppAuth();

  // Trial enforcement
  const { isBlocked: trialBlocked, isLoading: trialLoading } = useTrialEnforcement();

  // Check if user is Nello One super admin (has admin role in user_roles)
  const isNelloOneSuperAdmin = userRoles.includes('admin');

  // Show loading while checking auth or processing cross-app token
  if (authLoading || businessLoading || crossAppPending || trialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Nello One super admins have full access to Business without needing a company
  if (isNelloOneSuperAdmin) {
    return <>{children}</>;
  }

  // No company association
  if (!hasCompany && !companyUser) {
    // Check if coming from an invite
    if (location.pathname.includes('/onboarding')) {
      return <>{children}</>;
    }
    return <Navigate to="/" replace />;
  }

  // Collaborator needs consent
  if (needsConsent && !location.pathname.includes('/consent')) {
    return <Navigate to="/consent" replace />;
  }

  // Company admin needs onboarding
  if (needsOnboarding && !location.pathname.includes('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  // Trial enforcement: if blocked and NOT already on /billing, redirect
  if (enforceTrial && trialBlocked && !location.pathname.startsWith('/billing')) {
    return <Navigate to="/billing" replace />;
  }

  // Check role requirement
  if (requiredRole !== 'any' && businessRole !== requiredRole) {
    // Allow super_admin access to everything
    if (businessRole === 'super_admin') {
      return <>{children}</>;
    }
    
    // Company admin can't access collaborator-only routes
    if (requiredRole === 'collaborator' && businessRole === 'company_admin') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Collaborator can't access admin routes
    if (requiredRole === 'company_admin' && businessRole === 'collaborator') {
      return <Navigate to="/my-space" replace />;
    }
  }

  return <>{children}</>;
}
