import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { ImpersonateProvider } from "@/contexts/ImpersonateContext";
import { LanguageRoute } from "@/components/LanguageRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GeoRedirect } from "@/components/GeoRedirect";
import { CurrencyProtection } from "@/components/CurrencyProtection";
import { AffiliateTracker } from "@/hooks/useAffiliateTracking";
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
import CodigoEssenciaVenda from "./pages/CodigoEssenciaVenda";
import CodigoEssenciaCheckout from "./pages/CodigoEssenciaCheckout";
import ComprarTeste from "./pages/ComprarTeste";
import Fundadores from "./pages/Fundadores";
import FundadorFeedback from "./pages/FundadorFeedback";
import DiagnosticoPDF from "./pages/DiagnosticoPDF";

const queryClient = new QueryClient();

// Reusable route definitions
const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/fundadores" element={<Fundadores />} />
    
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
    
    {/* Código da Essência Sales - PT */}
    <Route path="/codigo-da-essencia" element={<CodigoEssenciaVenda />} />
    <Route path="/codigo-da-essencia/checkout" element={<CodigoEssenciaCheckout />} />
    <Route path="/codigo-da-essencia/view" element={
      <ProtectedRoute allowedRoles={["cliente", "admin"]}>
        <CodigoEssencia />
      </ProtectedRoute>
    } />
    
    {/* Test detail pages - EN (new semantic routes) */}
    <Route path="/en/tests/:slug" element={<TestDetailPage />} />
    
    {/* Essence Code Sales - EN */}
    <Route path="/en/essence-code-premium" element={<CodigoEssenciaVenda />} />
    <Route path="/en/essence-code/checkout" element={<CodigoEssenciaCheckout />} />
    <Route path="/en/essence-code/view" element={
      <ProtectedRoute allowedRoles={["cliente", "admin"]}>
        <CodigoEssencia />
      </ProtectedRoute>
    } />
    
    {/* EN Landing and Auth */}
    <Route path="/en" element={<Landing />} />
    <Route path="/en/auth" element={<Auth />} />
    
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
    
    {/* Código da Essência Sales - PT-PT */}
    <Route path="/pt-pt/codigo-da-essencia" element={<CodigoEssenciaVenda />} />
    <Route path="/pt-pt/codigo-da-essencia/checkout" element={<CodigoEssenciaCheckout />} />
    <Route path="/pt-pt/codigo-da-essencia/view" element={
      <ProtectedRoute allowedRoles={["cliente", "admin"]}>
        <CodigoEssencia />
      </ProtectedRoute>
    } />
    
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
    <Route path="/pt-pt" element={<Landing />} />
    
    {/* Founder Feedback Routes */}
    <Route
      path="/cliente/fundador-feedback"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FundadorFeedback />
        </ProtectedRoute>
      }
    />
    <Route
      path="/en/cliente/fundador-feedback"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FundadorFeedback />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pt-pt/cliente/fundador-feedback"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FundadorFeedback />
        </ProtectedRoute>
      }
    />
    
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
                    <AppRoutes />
                  </LanguageRoute>
                </CurrencyProtection>
              </ImpersonateProvider>
            </AuthProvider>
          </SimulationProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
