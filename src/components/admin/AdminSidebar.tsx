import { 
  Users, 
  Calendar, 
  FileText, 
  Image, 
  CreditCard, 
  Settings, 
  Shield,
  MessageSquare,
  BarChart3,
  Tag,
  Home
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home, exact: true },
  { title: "Usuários", url: "/admin/usuarios", icon: Users },
  { title: "Fotógrafos", url: "/admin/fotografos", icon: Image },
  { title: "Agendamentos", url: "/admin/agendamentos", icon: Calendar },
  { title: "Testes", url: "/admin/testes", icon: FileText },
  { title: "Pagamentos", url: "/admin/pagamentos", icon: CreditCard },
  { title: "Cupons", url: "/admin/cupons", icon: Tag },
  { title: "Comunicação", url: "/admin/comunicacao", icon: MessageSquare },
  { title: "Conteúdo Home", url: "/admin/home-content", icon: FileText },
  { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
  { title: "Logs de Auditoria", url: "/admin/logs", icon: Shield },
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
    active ? "bg-gold/20 text-gold font-semibold" : "hover:bg-accent";

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel Admin</SidebarGroupLabel>
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
