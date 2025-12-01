import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";

// Lazy load modules
const Dashboard2 = lazy(() => import("@/components/admin/Dashboard2").then(m => ({ default: m.Dashboard2 })));
const UsersManagement2 = lazy(() => import("@/components/admin/UsersManagement2").then(m => ({ default: m.UsersManagement2 })));
const TestsJourneysManagement2 = lazy(() => import("@/components/admin/TestsJourneysManagement2").then(m => ({ default: m.TestsJourneysManagement2 })));
const PlansAndCoupons2 = lazy(() => import("@/components/admin/PlansAndCoupons2").then(m => ({ default: m.PlansAndCoupons2 })));
const MiguelAIManagement2 = lazy(() => import("@/components/admin/MiguelAIManagement2").then(m => ({ default: m.MiguelAIManagement2 })));
const LandingContentManagement2 = lazy(() => import("@/components/admin/LandingContentManagement2").then(m => ({ default: m.LandingContentManagement2 })));
const ReportsManagement2 = lazy(() => import("@/components/admin/ReportsManagement2").then(m => ({ default: m.ReportsManagement2 })));
const SystemSettings2 = lazy(() => import("@/components/admin/SystemSettings2").then(m => ({ default: m.SystemSettings2 })));
const AdminTools = lazy(() => import("@/components/admin/AdminTools").then(m => ({ default: m.AdminTools })));
const SimulationMode = lazy(() => import("@/components/admin/SimulationMode").then(m => ({ default: m.SimulationMode })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Carregando...</span>
    </div>
  </div>
);

const Admin = () => {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header minimalista NELLO ONE style */}
          <header className="h-14 border-b border-border/40 flex items-center justify-between px-6 bg-background/90 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-ink transition-colors" />
              <div className="h-5 w-px bg-border/60" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-ink">NELLO ONE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bruma text-ink/70 font-medium">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RoleSwitcher />
              <div className="h-5 w-px bg-border/60" />
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-ink transition-colors">
                Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard2 />} />
                <Route path="/conteudo" element={<LandingContentManagement2 />} />
                <Route path="/usuarios" element={<UsersManagement2 />} />
                <Route path="/testes" element={<TestsJourneysManagement2 />} />
                <Route path="/planos" element={<PlansAndCoupons2 />} />
                <Route path="/miguel" element={<MiguelAIManagement2 />} />
                <Route path="/relatorios" element={<ReportsManagement2 />} />
                <Route path="/configuracoes" element={<SystemSettings2 />} />
                <Route path="/tools" element={<AdminTools />} />
                <Route path="/simulador" element={<SimulationMode />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
