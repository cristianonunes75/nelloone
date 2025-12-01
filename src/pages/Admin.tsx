import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { SystemSettings } from "@/components/admin/SystemSettings";
import logo from "@/assets/logo.png";
import { Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RoleSwitcher } from "@/components/RoleSwitcher";

// Lazy load modules
const UsersManagementV2 = lazy(() => import("@/components/admin/UsersManagementV2").then(m => ({ default: m.UsersManagementV2 })));
const TestsJourneysManagement = lazy(() => import("@/components/admin/TestsJourneysManagement").then(m => ({ default: m.TestsJourneysManagement })));
const PlansAndCoupons = lazy(() => import("@/components/admin/PlansAndCoupons").then(m => ({ default: m.PlansAndCoupons })));
const MiguelAIManagement = lazy(() => import("@/components/admin/MiguelAIManagement").then(m => ({ default: m.MiguelAIManagement })));
const LandingContentManagement = lazy(() => import("@/components/admin/LandingContentManagement").then(m => ({ default: m.LandingContentManagement })));
const ReportsManagement = lazy(() => import("@/components/admin/ReportsManagement").then(m => ({ default: m.ReportsManagement })));

const AdminDashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-2">Admin Essentia 2.0</h1>
      <p className="text-muted-foreground">Visão geral do sistema</p>
    </div>
    
    <DashboardStats />
    
    <Alert className="border-primary/20 bg-primary/5">
      <Shield className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">
        <strong>Acesso Master Ativo:</strong> Você tem controle total sobre o sistema. 
        Todas as ações são registradas nos logs de auditoria.
      </AlertDescription>
    </Alert>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">Admin</span>
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
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/conteudo" element={<LandingContentManagement />} />
                <Route path="/usuarios" element={<UsersManagementV2 />} />
                <Route path="/testes" element={<TestsJourneysManagement />} />
                <Route path="/planos" element={<PlansAndCoupons />} />
                <Route path="/miguel" element={<MiguelAIManagement />} />
                <Route path="/relatorios" element={<ReportsManagement />} />
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