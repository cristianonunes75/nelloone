import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ViewModeSelector } from "@/components/admin/ViewModeSelector";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { TestsManagement } from "@/components/admin/TestsManagement";
import { PaymentsManagement } from "@/components/admin/PaymentsManagement";
import { CouponsManagement } from "@/components/admin/CouponsManagement";
import { CommunicationManagement } from "@/components/admin/CommunicationManagement";
import { ReportsManagement } from "@/components/admin/ReportsManagement";
import { PhotographersManagement } from "@/components/admin/PhotographersManagement";
import { SchedulingManagement } from "@/components/admin/SchedulingManagement";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { SystemSettings } from "@/components/admin/SystemSettings";
import logo from "@/assets/logo.png";
import { Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const AdminHomeContent = lazy(() => import("@/pages/AdminHomeContent"));

const AdminDashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-muted-foreground">Visão geral do sistema Essentia</p>
    </div>
    
    <DashboardStats />
    
    <ViewModeSelector />
    
    <Alert className="border-gold/50 bg-gold/5">
      <Shield className="h-4 w-4 text-gold" />
      <AlertDescription className="text-sm">
        <strong>Acesso Master Ativo:</strong> Você tem controle total sobre o sistema. 
        Todas as ações são registradas nos logs de auditoria.
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
            <div className="flex items-center gap-4">
              <RoleSwitcher />
              <Button variant="outline" onClick={signOut}>
                Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>}>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/usuarios" element={<UsersManagement />} />
                <Route path="/fotografos" element={<PhotographersManagement />} />
                <Route path="/agendamentos" element={<SchedulingManagement />} />
                <Route path="/testes" element={<TestsManagement />} />
                <Route path="/pagamentos" element={<PaymentsManagement />} />
                <Route path="/cupons" element={<CouponsManagement />} />
                <Route path="/comunicacao" element={<CommunicationManagement />} />
                <Route path="/home-content" element={<AdminHomeContent />} />
                <Route path="/relatorios" element={<ReportsManagement />} />
                <Route path="/logs" element={<AuditLogs />} />
                <Route path="/configuracoes" element={<SystemSettings />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
