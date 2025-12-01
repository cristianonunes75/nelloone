import { 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  BarChart3,
  Home,
  Bot,
  FileEdit,
  Route
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home, exact: true },
  { title: "Landing e Conteúdo", url: "/admin/conteudo", icon: FileEdit },
  { title: "Usuários", url: "/admin/usuarios", icon: Users },
  { title: "Testes e Jornadas", url: "/admin/testes", icon: Route },
  { title: "Planos e Cupons", url: "/admin/planos", icon: CreditCard },
  { title: "Miguel – IA", url: "/admin/miguel", icon: Bot },
  { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return currentPath === url;
    return currentPath.startsWith(url);
  };

  const getNavCls = (active: boolean) =>
    cn(
      "transition-colors",
      active ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
    );

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}