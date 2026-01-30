import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAppSwitcher } from "@/components/admin/AdminAppSwitcher";
import { Loader2 } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";

// Lazy load admin modules
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminBusinessDashboard = lazy(() => import("@/components/admin/AdminBusinessDashboard").then(m => ({ default: m.AdminBusinessDashboard })));
const RealtimeDashboard = lazy(() => import("@/components/admin/RealtimeDashboard").then(m => ({ default: m.RealtimeDashboard })));
const AdminJourneyDashboard = lazy(() => import("@/components/admin/AdminJourneyDashboard").then(m => ({ default: m.AdminJourneyDashboard })));
const AdminUsersUnified = lazy(() => import("@/components/admin/AdminUsersUnified").then(m => ({ default: m.default })));
const AdminOrdersPayments = lazy(() => import("@/components/admin/AdminOrdersPayments").then(m => ({ default: m.AdminOrdersPayments })));
const AdminProductsTests = lazy(() => import("@/components/admin/AdminProductsTests").then(m => ({ default: m.AdminProductsTests })));
const AdminCoupons = lazy(() => import("@/components/admin/AdminCoupons").then(m => ({ default: m.AdminCoupons })));
const AdminCodigoEssencia = lazy(() => import("@/components/admin/AdminCodigoEssencia").then(m => ({ default: m.AdminCodigoEssencia })));
const AdminLogs = lazy(() => import("@/components/admin/AdminLogs").then(m => ({ default: m.AdminLogs })));
const AdminSettings = lazy(() => import("@/components/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AffiliatesManagement = lazy(() => import("@/components/admin/AffiliatesManagement").then(m => ({ default: m.AffiliatesManagement })));
const TestimonialsManagement = lazy(() => import("@/components/admin/TestimonialsManagement").then(m => ({ default: m.TestimonialsManagement })));
const AdminBrandIdentity = lazy(() => import("@/components/admin/AdminBrandIdentity").then(m => ({ default: m.AdminBrandIdentity })));
const AdminRealtimeVisitors = lazy(() => import("@/components/admin/AdminRealtimeVisitors").then(m => ({ default: m.AdminRealtimeVisitors })));
const DataCleanupTool = lazy(() => import("@/components/admin/DataCleanupTool").then(m => ({ default: m.DataCleanupTool })));
const NotificationAutomation = lazy(() => import("@/components/admin/NotificationAutomation").then(m => ({ default: m.NotificationAutomation })));
const AdminPermissionsManager = lazy(() => import("@/components/admin/AdminPermissionsManager").then(m => ({ default: m.AdminPermissionsManager })));
const ReportsManagement2 = lazy(() => import("@/components/admin/ReportsManagement2").then(m => ({ default: m.ReportsManagement2 })));
const CommunicationManagement = lazy(() => import("@/components/admin/CommunicationManagement").then(m => ({ default: m.CommunicationManagement })));
const AdminNotificationsHistory = lazy(() => import("@/components/admin/AdminNotificationsHistory").then(m => ({ default: m.AdminNotificationsHistory })));
const AdminSendReports = lazy(() => import("@/components/admin/AdminSendReports").then(m => ({ default: m.AdminSendReports })));
const AdminEngagementCenter = lazy(() => import("@/components/admin/AdminEngagementCenter").then(m => ({ default: m.default })));
const AdminTools = lazy(() => import("@/components/admin/AdminTools").then(m => ({ default: m.AdminTools })));
const AdminPostFactory = lazy(() => import("@/components/admin/AdminPostFactory").then(m => ({ default: m.AdminPostFactory })));
const AdminLandingPage = lazy(() => import("@/components/admin/AdminLandingPage").then(m => ({ default: m.AdminLandingPage })));

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
              <AdminAppSwitcher />
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
                <Route index element={<AdminDashboard />} />
                <Route path="business" element={<AdminBusinessDashboard />} />
                <Route path="tempo-real" element={<RealtimeDashboard />} />
                <Route path="relatorios" element={<ReportsManagement2 />} />
                <Route path="visitantes" element={<AdminRealtimeVisitors />} />
                <Route path="jornadas" element={<AdminJourneyDashboard />} />
                <Route path="afiliados" element={<AffiliatesManagement />} />
                <Route path="usuarios" element={<AdminUsersUnified />} />
                <Route path="pedidos" element={<AdminOrdersPayments />} />
                <Route path="produtos" element={<AdminProductsTests />} />
                <Route path="cupons" element={<AdminCoupons />} />
                <Route path="depoimentos" element={<TestimonialsManagement />} />
                <Route path="codigo-essencia" element={<AdminCodigoEssencia />} />
                <Route path="identidade-visual" element={<AdminBrandIdentity />} />
                <Route path="post-factory" element={<AdminPostFactory />} />
                <Route path="landing-page" element={<AdminLandingPage />} />
                <Route path="comunicacao" element={<CommunicationManagement />} />
                <Route path="engajamento" element={<AdminEngagementCenter />} />
                <Route path="enviar-relatorios" element={<AdminSendReports />} />
                <Route path="notificacoes-historico" element={<AdminNotificationsHistory />} />
                <Route path="permissoes" element={<AdminPermissionsManager />} />
                <Route path="limpeza" element={<DataCleanupTool />} />
                <Route path="notificacoes" element={<NotificationAutomation />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="tools" element={<AdminTools />} />
                <Route path="configuracoes" element={<AdminSettings />} />
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;