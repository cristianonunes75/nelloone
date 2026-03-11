import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { ImpersonateProvider } from "@/contexts/ImpersonateContext";
import { NelloAppProvider } from "@/contexts/NelloAppContext";
import { NelloAppRouter } from "@/components/NelloAppRouter";
import { LanguageRoute } from "@/components/LanguageRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GeoRedirect } from "@/components/GeoRedirect";
import { CurrencyProtection } from "@/components/CurrencyProtection";
import { AffiliateTracker } from "@/hooks/useAffiliateTracking";
import { ConsentGate } from "@/components/ConsentGate";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Cliente from "./pages/Cliente";
import ClientePerfil from "./pages/ClientePerfil";
import UserArea from "./pages/UserArea";
import TestExecution from "./pages/TestExecution";
import CodigoExpress from "./pages/CodigoExpress";
import TestResults from "./pages/TestResults";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Metodologia from "./pages/Metodologia";
import Os7Mapas from "./pages/Os7Mapas";
import { TestDetailPage } from "./components/tests/TestDetailPage";
import CodigoEssencia from "./pages/CodigoEssencia";
import AtivacaoCodigoPage from "./pages/cliente/AtivacaoCodigoPage";
import AtivacaoProfissionalPage from "./pages/cliente/AtivacaoProfissionalPage";
import CruzamentosPage from "./pages/cliente/CruzamentosPage";
import RevelacaoEssencia from "./pages/cliente/RevelacaoEssencia";
// CodigoEssencia sales pages removed - now included in journey
import ComprarTeste from "./pages/ComprarTeste";
import DiagnosticoPDF from "./pages/DiagnosticoPDF";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Checkout from "./pages/Checkout";
import JornadaIdentity from "./pages/JornadaIdentity";
import RelatorioConjugePublico from "./pages/RelatorioConjugePublico";
import RelatorioContextualPublico from "./pages/RelatorioContextualPublico";
import ResetPassword from "./pages/ResetPassword";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AcceptCrossingPage from "./pages/AcceptCrossingPage";
import CruzamentoPublico from "./pages/CruzamentoPublico";
import WhatsApp from "./pages/WhatsApp";
import ParaProfissionais from "./pages/ParaProfissionais";
import CentralAjuda from "./pages/CentralAjuda";
import ImersaoCasalLanding from "./pages/ImersaoCasalLanding";
import ConvitePessoal from "./pages/ConvitePessoal";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes default
      retry: 1,
    },
  },
});

// Component to run version check hook
const VersionChecker = ({ children }: { children: React.ReactNode }) => {
  useVersionCheck();
  return <>{children}</>;
};

// Reusable route definitions
const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/login" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/whatsapp" element={<WhatsApp />} />
    <Route path="/en/whatsapp" element={<WhatsApp />} />
    <Route path="/pt-pt/whatsapp" element={<WhatsApp />} />
    
    {/* Accept crossing invitation routes - public but requires login */}
    <Route path="/aceitar-cruzamento/:token" element={<AcceptCrossingPage />} />
    <Route path="/en/accept-crossing/:token" element={<AcceptCrossingPage />} />
    <Route path="/pt-pt/aceitar-cruzamento/:token" element={<AcceptCrossingPage />} />
    
    {/* Public crossing report routes */}
    <Route path="/cruzamento/:token" element={<CruzamentoPublico />} />
    <Route path="/en/crossing/:token" element={<CruzamentoPublico />} />
    <Route path="/pt-pt/cruzamento/:token" element={<CruzamentoPublico />} />
    
    {/* Public spouse report route (legacy) */}
    <Route path="/relatorio-conjuge/:token" element={<RelatorioConjugePublico />} />
    <Route path="/en/spouse-report/:token" element={<RelatorioConjugePublico />} />
    <Route path="/pt-pt/relatorio-conjuge/:token" element={<RelatorioConjugePublico />} />
    
    {/* Public contextual reports routes (new unified system) */}
    <Route path="/relatorio/:tipo/:token" element={<RelatorioContextualPublico />} />
    <Route path="/en/report/:tipo/:token" element={<RelatorioContextualPublico />} />
    <Route path="/pt-pt/relatorio/:tipo/:token" element={<RelatorioContextualPublico />} />
    
    {/* Jornada Identity - Sales page */}
    <Route path="/jornada-identity" element={<JornadaIdentity />} />
    <Route path="/en/identity-journey" element={<JornadaIdentity />} />
    
    {/* Checkout page - redirects to jornada-identity */}
    <Route path="/checkout" element={<JornadaIdentity />} />
    <Route path="/en/checkout" element={<JornadaIdentity />} />
    <Route path="/pt-pt/checkout" element={<JornadaIdentity />} />
    
    {/* Checkout success - verifies payment server-side */}
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/en/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/pt-pt/checkout/success" element={<CheckoutSuccess />} />
    
    {/* Subscription management */}
    <Route path="/assinatura" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    <Route path="/subscription" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    <Route path="/en/subscription" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    
    {/* Institutional pages */}
    <Route path="/metodologia" element={<Metodologia />} />
    <Route path="/en/methodology" element={<Metodologia />} />
    <Route path="/pt-pt/metodologia" element={<Metodologia />} />
    
    {/* Os 7 Mapas - Institutional page */}
    <Route path="/os-7-mapas" element={<Os7Mapas />} />
    <Route path="/en/the-7-maps" element={<Os7Mapas />} />
    <Route path="/pt-pt/os-7-mapas" element={<Os7Mapas />} />
    
    {/* Para Profissionais - Institutional page */}
    <Route path="/para-profissionais" element={<ParaProfissionais />} />
    <Route path="/en/for-professionals" element={<ParaProfissionais />} />
    <Route path="/pt-pt/para-profissionais" element={<ParaProfissionais />} />
    
    {/* Central de Ajuda - Help Center */}
    <Route path="/ajuda" element={<CentralAjuda />} />
    <Route path="/en/help" element={<CentralAjuda />} />
    <Route path="/pt-pt/ajuda" element={<CentralAjuda />} />
    
    {/* Imersão Código do Casal - Landing page */}
    <Route path="/imersao-casal" element={<ImersaoCasalLanding />} />

    {/* Convite Pessoal - Página emotiva para amigos */}
    <Route path="/convite" element={<ConvitePessoal />} />
    
    {/* Leitura Inicial - First identity reading */}
    <Route path="/leitura-inicial" element={<CodigoExpress />} />
    <Route path="/codigo-express" element={<CodigoExpress />} />
    <Route path="/codigo-inicial" element={<CodigoExpress />} />
    <Route path="/en/code-express" element={<CodigoExpress />} />
    <Route path="/en/initial-code" element={<CodigoExpress />} />
    <Route path="/en/initial-reading" element={<CodigoExpress />} />
    <Route path="/pt-pt/codigo-express" element={<CodigoExpress />} />
    <Route path="/pt-pt/codigo-inicial" element={<CodigoExpress />} />
    <Route path="/pt-pt/leitura-inicial" element={<CodigoExpress />} />
    {/* Legal pages - PT */}
    <Route path="/termos" element={<TermsOfService />} />
    <Route path="/termos-de-servico" element={<TermsOfService />} />
    <Route path="/privacidade" element={<PrivacyPolicy />} />
    <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
    <Route path="/contato" element={<Contact />} />
    
    {/* Legal pages - EN */}
    <Route path="/terms" element={<TermsOfService />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/contact" element={<Contact />} />
    
    {/* Test detail pages - PT (new semantic routes) */}
    <Route path="/testes/:slug" element={<TestDetailPage />} />
    
    {/* Test detail pages - EN (new semantic routes) */}
    <Route path="/en/tests/:slug" element={<TestDetailPage />} />
    
    {/* EN Landing and Auth */}
    <Route path="/en" element={<Landing />} />
    <Route path="/en/auth" element={<Auth />} />
    <Route path="/en/login" element={<Auth />} />
    <Route path="/en/reset-password" element={<ResetPassword />} />
    
    {/* Legal pages - EN with prefix */}
    <Route path="/en/terms" element={<TermsOfService />} />
    <Route path="/en/privacy" element={<PrivacyPolicy />} />
    <Route path="/en/contact" element={<Contact />} />
    
    {/* Protected client routes - EN */}
    <Route
      path="/en/cliente"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <Cliente />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/dashboard"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <Cliente />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/me"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <UserArea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/profile"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <UserArea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/perfil"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ClientePerfil />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/test-execution/:testId/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/test-execution/:testId/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/test-results/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/test-results/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/codigo-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/essence-code"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/comprar/:testId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ComprarTeste />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/purchase/:testId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ComprarTeste />
        </ProtectedRoute>
      }
    />
    
    {/* Test detail pages - PT-PT (European Portuguese) */}
    <Route path="/pt-pt/testes/:slug" element={<TestDetailPage />} />
    
    {/* Legal pages - PT-PT */}
    <Route path="/pt-pt/termos" element={<TermsOfService />} />
    <Route path="/pt-pt/privacidade" element={<PrivacyPolicy />} />
    <Route path="/pt-pt/contato" element={<Contact />} />
    
    {/* Protected client routes - PT-PT */}
    <Route
      path="/pt-pt/cliente"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <Cliente />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/me"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <UserArea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/perfil"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ClientePerfil />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/test-execution/:testId/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/test-results/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/codigo-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/comprar/:testId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ComprarTeste />
        </ProtectedRoute>
      }
    />
    <Route path="/pt-pt/auth" element={<Auth />} />
    <Route path="/pt-pt/reset-password" element={<ResetPassword />} />
    <Route path="/pt-pt" element={<Landing />} />
    
    {/* Journey redirect - /jornada -> /cliente (protected) */}
    <Route path="/jornada" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><Cliente /></ProtectedRoute>} />
    <Route path="/en/journey" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><Cliente /></ProtectedRoute>} />
    <Route path="/pt-pt/jornada" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><Cliente /></ProtectedRoute>} />
    
    {/* Protected client routes */}
    <Route
      path="/cliente"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <Cliente />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <Cliente />
        </ProtectedRoute>
      }
    />
    <Route
      path="/me"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <UserArea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/perfil"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ClientePerfil />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <UserArea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/test-execution/:testId/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/test-execution/:testId/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/test-results/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/test-results/:userTestId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <TestResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/codigo-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/codigo-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/revelacao"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <RevelacaoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/ativacao"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoCodigoPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ativacao-codigo"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoCodigoPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/activation"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoCodigoPage />
        </ProtectedRoute>
      }
    />
    {/* Professional Direction Activation routes */}
    <Route
      path="/ativacao-profissional"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoProfissionalPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/professional-activation"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoProfissionalPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/ativacao-profissional"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <AtivacaoProfissionalPage />
        </ProtectedRoute>
      }
    />
    {/* Cruzamentos (Code Crossing) routes */}
    <Route
      path="/cliente/cruzamentos"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CruzamentosPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cruzamentos"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CruzamentosPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/crossings"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CruzamentosPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/cruzamentos"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CruzamentosPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/cruzamentos"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CruzamentosPage />
        </ProtectedRoute>
      }
    />
    {/* SECURITY FIX: Removed admin view route /codigo-da-essencia/view
        This route allowed admins to view any user's sensitive psychological report.
        Admins should NOT have direct access to user's Código da Essência.
        The impersonation feature (via ImpersonateContext) remains available for
        legitimate support cases, as it has proper audit logging. */}
    <Route
      path="/essence-code"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cliente/comprar/:testId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ComprarTeste />
        </ProtectedRoute>
      }
    />
    <Route
      path="/purchase/:testId"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <ComprarTeste />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/*"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Admin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/diagnostico"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DiagnosticoPDF />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VersionChecker>
          <NelloAppProvider>
            <LanguageProvider>
              <SimulationProvider>
                <AuthProvider>
                  <ImpersonateProvider>
                    {/* GEO-routing: Automatically redirects based on IP location */}
                    <GeoRedirect />
                    {/* Affiliate tracking: Captures referral codes from URL */}
                    <AffiliateTracker />
                    {/* Currency Protection: Prevents cross-trade between BRL and USD */}
                    <CurrencyProtection>
                      {/* Consent Gate: Shows mandatory consent modal for users without LGPD consent */}
                      <ConsentGate>
                        <LanguageRoute>
                          {/* Nello App Router: Routes to Flow, Life, or One based on subdomain */}
                          <NelloAppRouter>
                            <AppRoutes />
                          </NelloAppRouter>
                        </LanguageRoute>
                      </ConsentGate>
                    </CurrencyProtection>
                  </ImpersonateProvider>
                </AuthProvider>
              </SimulationProvider>
            </LanguageProvider>
          </NelloAppProvider>
        </VersionChecker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
