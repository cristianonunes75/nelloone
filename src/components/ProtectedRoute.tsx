import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

type UserRole = "admin" | "fotografo" | "cliente";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = location.pathname;
      // Check if user is trying to access a test or purchase flow
      if (currentPath.includes("/cliente/test-execution") || currentPath.includes("/purchase")) {
        navigate("/auth?redirect=purchase");
      } else {
        navigate("/auth");
      }
    }

    if (!isLoading && user && allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case "admin":
          navigate("/admin");
          break;
        case "fotografo":
          navigate("/fotografo");
          break;
        case "cliente":
          navigate("/cliente");
          break;
        default:
          navigate("/");
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
