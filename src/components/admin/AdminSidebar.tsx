import { 
  Home, 
  Users, 
  CreditCard, 
  Settings, 
  BarChart3,
  Bot,
  FileEdit,
  Route,
  Wrench,
  FlaskConical,
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

const menuSections = [
  {
    label: "INÍCIO",
    items: [
      { title: "Dashboard", url: "/admin", icon: Home, exact: true },
    ]
  },
  {
    label: "GESTÃO",
    items: [
      { title: "Landing & Conteúdo", url: "/admin/conteudo", icon: FileEdit },
      { title: "Usuários", url: "/admin/usuarios", icon: Users },
      { title: "Testes & Jornadas", url: "/admin/testes", icon: Route },
      { title: "Planos & Cupons", url: "/admin/planos", icon: CreditCard },
      { title: "Miguel – IA", url: "/admin/miguel", icon: Bot },
      { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
    ]
  },
  {
    label: "FERRAMENTAS",
    items: [
      { title: "Modo Simulação", url: "/admin/simulador", icon: FlaskConical },
      { title: "Admin Tools", url: "/admin/tools", icon: Wrench },
    ]
  },
  {
    label: "SISTEMA",
    items: [
      { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
    ]
  }
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
      "transition-all duration-200 rounded-xl",
      active 
        ? "bg-ink text-primary-foreground font-medium shadow-sm" 
        : "text-muted-foreground hover:bg-bruma hover:text-ink"
    );

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

        {menuSections.map((section, sectionIndex) => (
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
