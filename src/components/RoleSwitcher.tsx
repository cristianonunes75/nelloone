import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User, ChevronDown } from "lucide-react";

type UserRole = "admin" | "cliente";

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="w-4 h-4" />,
  cliente: <User className="w-4 h-4" />,
};

const roleNames: Record<string, string> = {
  admin: "Administrador",
  cliente: "Cliente",
};

const roleRoutes: Record<string, string> = {
  admin: "/admin",
  cliente: "/cliente",
};

export const RoleSwitcher = () => {
  const { userRoles, setActiveRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show admin and cliente roles
  const availableRoles = userRoles?.filter((role): role is UserRole => role === "admin" || role === "cliente") || [];

  // Only show switcher if user has admin role (can switch between admin/cliente)
  if (!availableRoles.includes("admin")) {
    return null;
  }

  // Determine current role based on the current route, not the auth state
  const getCurrentRoleFromRoute = (): UserRole => {
    const path = location.pathname;
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/cliente")) return "cliente";
    // Default based on path patterns
    return "cliente";
  };

  const currentRouteRole = getCurrentRoleFromRoute();

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    navigate(roleRoutes[role]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {roleIcons[currentRouteRole]}
          {roleNames[currentRouteRole]}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Alternar Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {["admin", "cliente"].map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleSwitch(role as UserRole)}
            className="gap-2 cursor-pointer"
            disabled={currentRouteRole === role}
          >
            {roleIcons[role]}
            <span>{roleNames[role]}</span>
            {currentRouteRole === role && (
              <span className="ml-auto text-xs text-muted-foreground">Atual</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};