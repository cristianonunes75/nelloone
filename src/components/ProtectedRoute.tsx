import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  
  // Detect language from current path
  const getBasePath = () => {
    if (location.pathname.startsWith('/en/')) return '/en';
    if (location.pathname.startsWith('/pt-pt/')) return '/pt-pt';
    return '';
  };

  useEffect(() => {
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
  }, [user, userRole, isLoading, allowedRoles, navigate, location.pathname]);

  if (isLoading) {
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
