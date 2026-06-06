import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBibliotecaAccess } from '../contexts/BibliotecaAccessContext';

export function BibliotecaProtectedRoute({
  children,
  requireOwner = false,
}: {
  children: ReactNode;
  requireOwner?: boolean;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading, hasAccess, isOwner } = useBibliotecaAccess();
  const location = useLocation();

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50/30">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-amber-50/30 px-6 text-center">
        <Lock className="h-10 w-10 text-amber-700/70" />
        <h1 className="font-serif text-xl font-semibold text-amber-900">Acesso restrito</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Esta biblioteca é privada. Peça ao responsável para liberar o seu e-mail.
        </p>
      </div>
    );
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/biblioteca" replace />;
  }

  return <>{children}</>;
}
