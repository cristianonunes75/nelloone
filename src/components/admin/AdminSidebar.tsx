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
  ChevronDown
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
    label: "SISTEMA",
    items: [
      { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
      { title: "Admin Tools", url: "/admin/tools", icon: Wrench },
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
      "transition-all duration-200 rounded-lg",
      active 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  return (
    <Sidebar className={cn("border-r border-border/50", open ? "w-64" : "w-16")} collapsible="icon">
      <SidebarContent className="py-6 px-3">
        {menuSections.map((section, sectionIndex) => (
          <SidebarGroup key={section.label} className={sectionIndex > 0 ? "mt-6" : ""}>
            {open && (
              <SidebarGroupLabel className="px-3 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase mb-2">
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
                        <item.icon className="w-4 h-4 shrink-0" />
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
