import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCrossAppAuth } from '@/hooks/useCrossAppAuth';
import { Loader2, Heart } from 'lucide-react';

interface LifeProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route wrapper for Nello Life.
 * Handles cross-app authentication tokens.
 */
export function LifeProtectedRoute({ children }: LifeProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { isPending: crossAppPending } = useCrossAppAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || crossAppPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-emerald-300/70 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
