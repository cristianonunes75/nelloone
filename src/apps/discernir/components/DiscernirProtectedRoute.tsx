import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDiscernirAuth } from '../contexts/DiscernirAuthContext';
import { Loader2 } from 'lucide-react';

interface DiscernirProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'priest' | 'couple';
  requiresConsent?: boolean;
  requiresCouple?: boolean;
}

export function DiscernirProtectedRoute({
  children,
  requiredRole,
  requiresConsent = false,
  requiresCouple = false,
}: DiscernirProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    role, 
    couple,
    isLoading: discernirLoading,
    hasIndividualConsent,
    hasPriestAccessConsent,
  } = useDiscernirAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (authLoading || discernirLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-700 mx-auto" />
          <p className="text-amber-800/80">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole === 'priest' && role !== 'priest' && role !== 'coordinator') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'couple' && role !== 'couple') {
    return <Navigate to="/" replace />;
  }

  // Check consent requirement
  if (requiresConsent && !hasIndividualConsent && !hasPriestAccessConsent) {
    return <Navigate to="/consentimento" replace />;
  }

  // Check couple requirement
  if (requiresCouple && !couple) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
