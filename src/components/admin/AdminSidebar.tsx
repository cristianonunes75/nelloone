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
  Home,
  DollarSign,
  Bot,
  Zap,
  FileEdit,
  PanelLeft
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
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home, exact: true },
  
  // Essencial
  { title: "Usuários", url: "/admin/usuarios", icon: Users, group: "essencial" },
  { title: "Testes & Perguntas", url: "/admin/testes-perguntas", icon: FileText, group: "essencial" },
  { title: "Pagamentos & Cupons", url: "/admin/pagamentos-cupons", icon: CreditCard, group: "essencial" },
  
  // Inteligência
  { title: "Miguel – IA", url: "/admin/miguel", icon: Bot, group: "inteligencia" },
  { title: "Conteúdo Dinâmico", url: "/admin/conteudo", icon: FileEdit, group: "inteligencia" },
  { title: "Relatórios & PDFs", url: "/admin/relatorios", icon: BarChart3, group: "inteligencia" },
  
  // Automação
  { title: "Automações", url: "/admin/automacoes", icon: Zap, group: "automacao" },
  { title: "Logs & Segurança", url: "/admin/logs", icon: Shield, group: "automacao" },
  
  // Legado (hidden)
  { title: "Fotógrafos", url: "/admin/fotografos", icon: Image, group: "legado", hidden: true },
  { title: "Agendamentos", url: "/admin/agendamentos", icon: Calendar, group: "legado", hidden: true },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings, group: "legado", hidden: true },
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

  const visibleItems = menuItems.filter(item => !item.hidden);
  const dashboardItem = visibleItems.find(item => item.exact);
  const essencialItems = visibleItems.filter(item => item.group === "essencial");
  const inteligenciaItems = visibleItems.filter(item => item.group === "inteligencia");
  const automacaoItems = visibleItems.filter(item => item.group === "automacao");

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent className="py-4">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItem && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={dashboardItem.url}
                      end={dashboardItem.exact}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <dashboardItem.icon className="w-4 h-4" />
                      {open && <span>{dashboardItem.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Essencial */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">Essencial</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {essencialItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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

        {/* Inteligência */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">Inteligência</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {inteligenciaItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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

        {/* Automação & Segurança */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider">Automação & Segurança</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {automacaoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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
