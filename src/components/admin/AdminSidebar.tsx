import { 
  Home, 
  Users, 
  CreditCard, 
  Settings, 
  Package,
  Ticket,
  Sparkles,
  Activity,
  Star,
  UserCheck,
  MessageSquareHeart,
  Palette,
  Eye,
  Trash2,
  Bell,
  Zap,
  Shield,
  BarChart3,
  Send,
  Target,
  Building2,
  Wrench,
  FileEdit,
  DollarSign,
  PieChart,
  UserPlus,
  Kanban,
  CalendarCheck,
  BookOpen,
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
import { useAdminPermissions, AdminPermissions } from "@/hooks/useAdminPermissions";

type PermissionKey = keyof Omit<AdminPermissions, 'id' | 'user_id' | 'permission_level'>;

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  exact?: boolean;
  permission?: PermissionKey | 'super_admin_only';
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    label: "MÉTRICAS",
    items: [
      { title: "Dashboard", url: "/admin", icon: Home, exact: true, permission: 'can_view_reports' },
      { title: "Business", url: "/admin/business", icon: Building2, permission: 'can_view_reports' },
      { title: "Tempo Real", url: "/admin/tempo-real", icon: Zap, permission: 'can_view_reports' },
      { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3, permission: 'can_view_reports' },
      { title: "Visitantes", url: "/admin/visitantes", icon: Eye, permission: 'can_view_reports' },
    ]
  },
  {
    label: "USUÁRIOS",
    items: [
      { title: "Usuários & Jornadas", url: "/admin/usuarios", icon: Users, permission: 'can_view_reports' },
      { title: "Afiliados", url: "/admin/afiliados", icon: UserCheck, permission: 'can_view_reports' },
    ]
  },
  {
    label: "CRM",
    items: [
      { title: "Leads", url: "/admin/leads", icon: UserPlus, permission: 'can_manage_leads' },
      { title: "Pipeline", url: "/admin/pipeline", icon: Kanban, permission: 'can_manage_leads' },
      { title: "Follow-ups", url: "/admin/followups", icon: CalendarCheck, permission: 'can_manage_leads' },
      { title: "Playbook", url: "/admin/vendas-playbook", icon: BookOpen, permission: 'can_manage_leads' },
    ]
  },
  {
    label: "VENDAS",
    items: [
      { title: "Pedidos", url: "/admin/pedidos", icon: CreditCard, permission: 'can_view_reports' },
      { title: "Relatório de Vendas", url: "/admin/vendas", icon: PieChart, permission: 'can_view_reports' },
      { title: "Produtos & Testes", url: "/admin/produtos", icon: Package, permission: 'can_view_reports' },
      { title: "Gestão de Preços", url: "/admin/precos", icon: DollarSign, permission: 'super_admin_only' },
      { title: "Cupons", url: "/admin/cupons", icon: Ticket, permission: 'can_view_reports' },
    ]
  },
  {
    label: "CONTEÚDO",
    items: [
      { title: "Landing Page", url: "/admin/landing-page", icon: FileEdit, permission: 'can_manage_settings' },
      { title: "Código da Essência", url: "/admin/codigo-essencia", icon: Sparkles, permission: 'super_admin_only' },
      { title: "Depoimentos", url: "/admin/depoimentos", icon: MessageSquareHeart, permission: 'can_manage_settings' },
      { title: "Identidade Visual & Posts", url: "/admin/identidade-visual", icon: Palette, permission: 'can_manage_settings' },
    ]
  },
  {
    label: "COMUNICAÇÃO",
    items: [
      { title: "Engajamento", url: "/admin/engajamento", icon: Target, permission: 'can_send_notifications' },
      { title: "Inbox", url: "/admin/comunicacao", icon: MessageSquareHeart, permission: 'can_send_notifications' },
      { title: "Enviar Relatórios", url: "/admin/enviar-relatorios", icon: Send, permission: 'can_send_notifications' },
      { title: "Histórico Push", url: "/admin/notificacoes-historico", icon: Bell, permission: 'can_view_reports' },
    ]
  },
  {
    label: "SISTEMA",
    items: [
      { title: "Permissões", url: "/admin/permissoes", icon: Shield, permission: 'super_admin_only' },
      { title: "Alertas Admin", url: "/admin/alertas-admin", icon: Bell, permission: 'can_manage_settings' },
      { title: "Notificações Push", url: "/admin/notificacoes", icon: Bell, permission: 'can_send_notifications' },
      { title: "Limpeza de Dados", url: "/admin/limpeza", icon: Trash2, permission: 'can_delete_data' },
      { title: "Tools", url: "/admin/tools", icon: Wrench, permission: 'super_admin_only' },
      { title: "Logs", url: "/admin/logs", icon: Activity, permission: 'super_admin_only' },
      { title: "Configurações", url: "/admin/configuracoes", icon: Settings, permission: 'can_manage_settings' },
    ]
  }
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission, isSuperAdmin, isLoading } = useAdminPermissions();

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return currentPath === url;
    return currentPath.startsWith(url);
  };

  const getNavCls = (active: boolean) =>
    cn(
      "transition-all duration-200 rounded-xl",
      active 
        ? "bg-ink text-primary-foreground font-medium shadow-sm" 
        : "text-muted-foreground hover:bg-bruma hover:text-ink"
    );

  const canAccessItem = (item: MenuItem): boolean => {
    if (!item.permission) return true;
    if (isSuperAdmin) return true;
    if (item.permission === 'super_admin_only') return false;
    return hasPermission(item.permission as PermissionKey);
  };

  const getVisibleSections = () => {
    return menuSections.map(section => ({
      ...section,
      items: section.items.filter(canAccessItem)
    })).filter(section => section.items.length > 0);
  };

  const visibleSections = getVisibleSections();

  return (
    <Sidebar className={cn("border-r border-border/40 bg-background", open ? "w-64" : "w-16")} collapsible="icon">
      <SidebarContent className="py-6 px-3">
        {/* Logo area when expanded */}
        {open && (
          <div className="px-3 mb-8">
            <h2 className="text-lg font-semibold tracking-tight text-ink">NELLO ONE</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Painel Administrativo</p>
          </div>
        )}

        {visibleSections.map((section, sectionIndex) => (
          <SidebarGroup key={section.label} className={sectionIndex > 0 ? "mt-6" : ""}>
            {open && (
              <SidebarGroupLabel className="px-3 text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase mb-2">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink
                        to={item.url}
                        end={item.exact}
                        className={({ isActive }) => getNavCls(isActive)}
                      >
                        <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        {open && <span className="ml-3 text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}