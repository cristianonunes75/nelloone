import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAppSwitcher } from "@/components/admin/AdminAppSwitcher";
import { Loader2 } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { AdminGuard } from "@/components/admin/AdminGuard";

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
// AdminBrandIdentity removed - consolidated into AdminPostFactory
const AdminRealtimeVisitors = lazy(() => import("@/components/admin/AdminRealtimeVisitors").then(m => ({ default: m.AdminRealtimeVisitors })));
const DataCleanupTool = lazy(() => import("@/components/admin/DataCleanupTool").then(m => ({ default: m.DataCleanupTool })));
const NotificationAutomation = lazy(() => import("@/components/admin/NotificationAutomation").then(m => ({ default: m.NotificationAutomation })));
const AdminPermissionsManager = lazy(() => import("@/components/admin/AdminPermissionsManager").then(m => ({ default: m.AdminPermissionsManager })));
// ReportsManagement2 removed - consolidated into AdminSalesReport
const CommunicationManagement = lazy(() => import("@/components/admin/CommunicationManagement").then(m => ({ default: m.CommunicationManagement })));
const AdminNotificationsHistory = lazy(() => import("@/components/admin/AdminNotificationsHistory").then(m => ({ default: m.AdminNotificationsHistory })));
const AdminSendReports = lazy(() => import("@/components/admin/AdminSendReports").then(m => ({ default: m.AdminSendReports })));
const AdminEngagementCenter = lazy(() => import("@/components/admin/AdminEngagementCenter").then(m => ({ default: m.default })));
const AdminTools = lazy(() => import("@/components/admin/AdminTools").then(m => ({ default: m.AdminTools })));
const AdminPostFactory = lazy(() => import("@/components/admin/AdminPostFactory").then(m => ({ default: m.AdminPostFactory })));
const AdminLandingPage = lazy(() => import("@/components/admin/AdminLandingPage").then(m => ({ default: m.AdminLandingPage })));
const AdminNotificationSettings = lazy(() => import("@/components/admin/AdminNotificationSettings").then(m => ({ default: m.AdminNotificationSettings })));
const AdminSalesReport = lazy(() => import("@/components/admin/AdminSalesReport").then(m => ({ default: m.AdminSalesReport })));
const AdminPriceManager = lazy(() => import("@/components/admin/AdminPriceManager").then(m => ({ default: m.AdminPriceManager })));

// Mini CRM modules
const AdminLeads = lazy(() => import("@/components/admin/AdminLeads").then(m => ({ default: m.AdminLeads })));
const AdminPipeline = lazy(() => import("@/components/admin/AdminPipeline").then(m => ({ default: m.AdminPipeline })));
const AdminFollowups = lazy(() => import("@/components/admin/AdminFollowups").then(m => ({ default: m.AdminFollowups })));
const AdminSalesPlaybook = lazy(() => import("@/components/admin/AdminSalesPlaybook").then(m => ({ default: m.AdminSalesPlaybook })));

// DISCERNIR modules
const AdminDiscernirDashboard = lazy(() => import("@/components/admin/discernir/AdminDiscernirDashboard"));
const AdminDiscernirParoquias = lazy(() => import("@/components/admin/discernir/AdminDiscernirParoquias"));
const AdminDiscernirPadres = lazy(() => import("@/components/admin/discernir/AdminDiscernirPadres"));
const AdminDiscernirCasais = lazy(() => import("@/components/admin/discernir/AdminDiscernirCasais"));
const AdminDiscernirConvites = lazy(() => import("@/components/admin/discernir/AdminDiscernirConvites"));
const AdminDiscernirConsentimentos = lazy(() => import("@/components/admin/discernir/AdminDiscernirConsentimentos"));
const AdminDiscernirAcessos = lazy(() => import("@/components/admin/discernir/AdminDiscernirAcessos"));
const AdminControlCenter = lazy(() => import("@/components/admin/AdminControlCenter"));

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
                <Route path="relatorios" element={<AdminSalesReport />} />
                <Route path="visitantes" element={<AdminRealtimeVisitors />} />
                <Route path="jornadas" element={<AdminJourneyDashboard />} />
                <Route path="afiliados" element={<AffiliatesManagement />} />
                <Route path="usuarios" element={<AdminUsersUnified />} />
                <Route path="pedidos" element={<AdminOrdersPayments />} />
                <Route path="produtos" element={<AdminProductsTests />} />
                <Route path="vendas" element={<AdminSalesReport />} />
                <Route path="cupons" element={<AdminCoupons />} />
                <Route path="comunicacao" element={<CommunicationManagement />} />
                <Route path="engajamento" element={<AdminEngagementCenter />} />
                <Route path="enviar-relatorios" element={<AdminSendReports />} />
                <Route path="notificacoes-historico" element={<AdminNotificationsHistory />} />
                <Route path="notificacoes" element={<NotificationAutomation />} />
                
                {/* Mini CRM routes */}
                <Route path="leads" element={
                  <AdminGuard requiredPermission="can_manage_leads" fallbackMessage="Gerenciamento de leads requer permissão específica.">
                    <AdminLeads />
                  </AdminGuard>
                } />
                <Route path="pipeline" element={
                  <AdminGuard requiredPermission="can_manage_leads" fallbackMessage="Pipeline de vendas requer permissão específica.">
                    <AdminPipeline />
                  </AdminGuard>
                } />
                <Route path="followups" element={
                  <AdminGuard requiredPermission="can_manage_leads" fallbackMessage="Follow-ups requer permissão específica.">
                    <AdminFollowups />
                  </AdminGuard>
                } />
                <Route path="vendas-playbook" element={
                  <AdminGuard requiredPermission="can_manage_leads" fallbackMessage="Playbook de vendas requer permissão específica.">
                    <AdminSalesPlaybook />
                  </AdminGuard>
                } />
                
                {/* Protected routes - isSuperAdminOnly */}
                <Route path="precos" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="Gerenciamento de preços é restrito a Super Admins.">
                    <AdminPriceManager />
                  </AdminGuard>
                } />
                <Route path="permissoes" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="Gerenciamento de permissões é restrito a Super Admins.">
                    <AdminPermissionsManager />
                  </AdminGuard>
                } />
                <Route path="logs" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="Logs de auditoria são restritos a Super Admins.">
                    <AdminLogs />
                  </AdminGuard>
                } />
                <Route path="tools" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="Ferramentas de desenvolvimento são restritas a Super Admins.">
                    <AdminTools />
                  </AdminGuard>
                } />
                <Route path="codigo-essencia" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="Gestão do Código da Essência é restrita a Super Admins.">
                    <AdminCodigoEssencia />
                  </AdminGuard>
                } />
                
                {/* Protected routes - can_manage_settings */}
                <Route path="landing-page" element={
                  <AdminGuard requiredPermission="can_manage_settings" fallbackMessage="Edição da landing page requer permissão de configurações.">
                    <AdminLandingPage />
                  </AdminGuard>
                } />
                <Route path="depoimentos" element={
                  <AdminGuard requiredPermission="can_manage_settings" fallbackMessage="Gestão de depoimentos requer permissão de configurações.">
                    <TestimonialsManagement />
                  </AdminGuard>
                } />
                <Route path="identidade-visual" element={
                  <AdminGuard requiredPermission="can_manage_settings" fallbackMessage="Identidade visual requer permissão de configurações.">
                    <AdminPostFactory />
                  </AdminGuard>
                } />
                <Route path="alertas-admin" element={
                  <AdminGuard requiredPermission="can_manage_settings" fallbackMessage="Configurações de alertas requer permissão de configurações.">
                    <AdminNotificationSettings />
                  </AdminGuard>
                } />
                <Route path="configuracoes" element={
                  <AdminGuard requiredPermission="can_manage_settings" fallbackMessage="Configurações do sistema requer permissão específica.">
                    <AdminSettings />
                  </AdminGuard>
                } />
                
                {/* Protected routes - can_delete_data */}
                <Route path="limpeza" element={
                  <AdminGuard requiredPermission="can_delete_data" fallbackMessage="Limpeza de dados requer permissão de exclusão.">
                    <DataCleanupTool />
                  </AdminGuard>
                } />
                
                {/* DISCERNIR routes - Super Admin only */}
                <Route path="discernir" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirDashboard />
                  </AdminGuard>
                } />
                <Route path="discernir/paroquias" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirParoquias />
                  </AdminGuard>
                } />
                <Route path="discernir/padres" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirPadres />
                  </AdminGuard>
                } />
                <Route path="discernir/casais" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirCasais />
                  </AdminGuard>
                } />
                <Route path="discernir/convites" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirConvites />
                  </AdminGuard>
                } />
                <Route path="discernir/consentimentos" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirConsentimentos />
                  </AdminGuard>
                } />
                <Route path="discernir/acessos" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O módulo DISCERNIR é restrito a Super Admins.">
                    <AdminDiscernirAcessos />
                  </AdminGuard>
                } />
                
                {/* Control Center - Super Admin only */}
                <Route path="control-center" element={
                  <AdminGuard isSuperAdminOnly fallbackMessage="O Control Center é restrito a Super Admins.">
                    <AdminControlCenter />
                  </AdminGuard>
                } />
                
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