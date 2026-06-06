import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMiniMercado } from '../contexts/MiniMercadoContext';
import { Loader2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  requireEvent?: boolean;
  requireGestor?: boolean;
}

export function MiniMercadoProtectedRoute({
  children,
  requireEvent = true,
  requireGestor = false,
}: Props) {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading, activeEvent, activeRole } = useMiniMercado();
  const location = useLocation();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 animate-spin text-amber-700 mx-auto" />
          <p className="text-amber-800/80 text-sm">Carregando Mini Mercado...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireEvent && !activeEvent) {
    return <Navigate to="/mini-mercado" replace />;
  }

  if (requireGestor && activeRole !== 'gestor') {
    return <Navigate to="/mini-mercado/balcao" replace />;
  }

  return <>{children}</>;
}
