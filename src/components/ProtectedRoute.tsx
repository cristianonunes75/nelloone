import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCrossAppAuth } from "@/hooks/useCrossAppAuth";
import { useNavigate, useLocation } from "react-router-dom";

type UserRole = "admin" | "cliente";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle cross-app authentication tokens (from AdminAppSwitcher)
  const { isPending: crossAppPending } = useCrossAppAuth();
  
  // Detect language from current path
  const getBasePath = () => {
    if (location.pathname.startsWith('/en/')) return '/en';
    if (location.pathname.startsWith('/pt-pt/')) return '/pt-pt';
    return '';
  };

  useEffect(() => {
    // Wait for cross-app auth to complete before redirecting
    if (crossAppPending) return;
    
    const basePath = getBasePath();
    
    if (!isLoading && !user) {
      const currentPath = location.pathname;
      // Check if user is trying to access a test or purchase flow
      if (currentPath.includes("/cliente/test-execution") || currentPath.includes("/purchase")) {
        navigate(`${basePath}/auth?redirect=purchase`);
      } else {
        navigate(`${basePath}/auth`);
      }
    }

    if (!isLoading && user && allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case "admin":
          navigate("/admin");
          break;
        case "cliente":
          navigate(`${basePath}/cliente`);
          break;
        default:
          navigate(basePath || "/");
      }
    }
  }, [user, userRole, isLoading, allowedRoles, navigate, location.pathname, crossAppPending]);

  // Show loading while auth is loading or cross-app token is being validated
  if (isLoading || crossAppPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};
