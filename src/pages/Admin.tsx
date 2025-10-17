import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { SystemSettings } from "@/components/admin/SystemSettings";
import logo from "@/assets/logo.png";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-muted-foreground">Visão geral do sistema Essentia</p>
    </div>
    <DashboardStats />
    <Alert className="border-gold/50 bg-gold/5">
      <Shield className="h-4 w-4 text-gold" />
      <AlertDescription className="text-sm">
        <strong>Acesso Master Ativo:</strong> Você tem controle total sobre o sistema. 
        Todas as ações são registradas nos logs de auditoria.
      </AlertDescription>
    </Alert>
  </div>
);

const PlaceholderSection = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold">{title}</h2>
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {description} - Módulo em desenvolvimento.
      </AlertDescription>
    </Alert>
  </div>
);

const Admin = () => {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <img src={logo} alt="Essentia" className="h-8" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                <span className="font-semibold">Admin Master</span>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </header>

          <main className="flex-1 p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/usuarios" element={<UsersManagement />} />
              <Route path="/logs" element={<AuditLogs />} />
              <Route path="/configuracoes" element={<SystemSettings />} />
              <Route 
                path="/fotografos" 
                element={<PlaceholderSection title="Gerenciamento de Fotógrafos" description="Aprovar, remover e gerenciar fotógrafos" />} 
              />
              <Route 
                path="/agendamentos" 
                element={<PlaceholderSection title="Agendamentos" description="Visualizar e gerenciar todas as sessões" />} 
              />
              <Route 
                path="/testes" 
                element={<PlaceholderSection title="Testes e Formulários" description="Editar perguntas e visualizar estatísticas" />} 
              />
              <Route 
                path="/pagamentos" 
                element={<PlaceholderSection title="Gestão Financeira" description="Relatórios e controle de pagamentos" />} 
              />
              <Route 
                path="/cupons" 
                element={<PlaceholderSection title="Cupons e Promoções" description="Criar e gerenciar cupons de desconto" />} 
              />
              <Route 
                path="/comunicacao" 
                element={<PlaceholderSection title="Comunicação" description="Envio de mensagens e notificações" />} 
              />
              <Route 
                path="/relatorios" 
                element={<PlaceholderSection title="Relatórios" description="Analytics e métricas do sistema" />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
