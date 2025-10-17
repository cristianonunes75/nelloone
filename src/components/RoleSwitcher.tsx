import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Camera, User, ChevronDown } from "lucide-react";

type UserRole = "admin" | "fotografo" | "cliente";

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="w-4 h-4" />,
  fotografo: <Camera className="w-4 h-4" />,
  cliente: <User className="w-4 h-4" />,
};

const roleNames: Record<UserRole, string> = {
  admin: "Administrador",
  fotografo: "Fotógrafo",
  cliente: "Cliente",
};

const roleRoutes: Record<UserRole, string> = {
  admin: "/admin",
  fotografo: "/fotografo",
  cliente: "/cliente",
};

export const RoleSwitcher = () => {
  const { userRoles, userRole } = useAuth();
  const navigate = useNavigate();

  // Only show switcher if user has multiple roles
  if (!userRoles || userRoles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = (role: UserRole) => {
    navigate(roleRoutes[role]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {userRole && roleIcons[userRole]}
          {userRole && roleNames[userRole]}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Alternar Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleSwitch(role)}
            className="gap-2 cursor-pointer"
            disabled={role === userRole}
          >
            {roleIcons[role]}
            <span>{roleNames[role]}</span>
            {role === userRole && (
              <span className="ml-auto text-xs text-muted-foreground">Atual</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
