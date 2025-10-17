import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type UserRole = "admin" | "fotografo" | "cliente";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
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
  }, [user, userRole, isLoading, allowedRoles, navigate]);

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
