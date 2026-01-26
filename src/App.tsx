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
import { useVersionCheck } from "@/hooks/useVersionCheck";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Cliente from "./pages/Cliente";
import ClientePerfil from "./pages/ClientePerfil";
import UserArea from "./pages/UserArea";
import TestExecution from "./pages/TestExecution";
import TestResults from "./pages/TestResults";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import { TestDetailPage } from "./components/tests/TestDetailPage";
import CodigoEssencia from "./pages/CodigoEssencia";
import AtivacaoCodigoPage from "./pages/cliente/AtivacaoCodigoPage";
import CruzamentosPage from "./pages/cliente/CruzamentosPage";
// CodigoEssencia sales pages removed - now included in journey
import ComprarTeste from "./pages/ComprarTeste";
import DiagnosticoPDF from "./pages/DiagnosticoPDF";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Checkout from "./pages/Checkout";
import RelatorioConjugePublico from "./pages/RelatorioConjugePublico";
import RelatorioContextualPublico from "./pages/RelatorioContextualPublico";
import ResetPassword from "./pages/ResetPassword";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AcceptCrossingPage from "./pages/AcceptCrossingPage";
import CruzamentoPublico from "./pages/CruzamentoPublico";
import WhatsApp from "./pages/WhatsApp";
const queryClient = new QueryClient();

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
    
    {/* Checkout page - purchase journey */}
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/en/checkout" element={<Checkout />} />
    <Route path="/pt-pt/checkout" element={<Checkout />} />
    
    {/* Checkout success - verifies payment server-side */}
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/en/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/pt-pt/checkout/success" element={<CheckoutSuccess />} />
    
    {/* Subscription management */}
    <Route path="/assinatura" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    <Route path="/subscription" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    <Route path="/en/subscription" element={<ProtectedRoute allowedRoles={["cliente", "admin"]}><SubscriptionManagement /></ProtectedRoute>} />
    
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
    
    {/* Journey redirect - /jornada -> /cliente */}
    <Route path="/jornada" element={<Cliente />} />
    <Route path="/en/journey" element={<Cliente />} />
    <Route path="/pt-pt/jornada" element={<Cliente />} />
    
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
    {/* Admin view route for viewing any user's codigo */}
    <Route
      path="/codigo-da-essencia/view"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <CodigoEssencia />
        </ProtectedRoute>
      }
    />
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
                      <LanguageRoute>
                        {/* Nello App Router: Routes to Flow, Life, or One based on subdomain */}
                        <NelloAppRouter>
                          <AppRoutes />
                        </NelloAppRouter>
                      </LanguageRoute>
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
