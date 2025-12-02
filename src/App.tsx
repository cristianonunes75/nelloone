import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { LanguageRoute } from "@/components/LanguageRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GeoRedirect } from "@/components/GeoRedirect";
import { CurrencyProtection } from "@/components/CurrencyProtection";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Cliente from "./pages/Cliente";
import ClientePerfil from "./pages/ClientePerfil";
import UserArea from "./pages/UserArea";
import TestExecution from "./pages/TestExecution";
import TestResults from "./pages/TestResults";
import Fotografo from "./pages/Fotografo";
import Admin from "./pages/Admin";
import Influence from "./pages/Influence";
import ConsultoriaEssentia from "./pages/ConsultoriaEssentia";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import { TestDetailPage } from "./components/tests/TestDetailPage";
import MapaEssencia from "./pages/MapaEssencia";
import ComprarTeste from "./pages/ComprarTeste";

const queryClient = new QueryClient();

// Reusable route definitions
const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/influence" element={<Influence />} />
    <Route path="/consultoria-essentia" element={<ConsultoriaEssentia />} />
    
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
      path="/pt-pt/cliente/mapa-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <MapaEssencia />
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
      path="/cliente/mapa-essencia"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <MapaEssencia />
        </ProtectedRoute>
      }
    />
    <Route
      path="/essence-map"
      element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <MapaEssencia />
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
      path="/fotografo"
      element={
        <ProtectedRoute allowedRoles={["fotografo", "admin"]}>
          <Fotografo />
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
              {/* GEO-routing: Automatically redirects based on IP location */}
              <GeoRedirect />
              {/* Currency Protection: Prevents cross-trade between BRL and USD */}
              <CurrencyProtection>
                <LanguageRoute>
                  <AppRoutes />
                </LanguageRoute>
              </CurrencyProtection>
            </AuthProvider>
          </SimulationProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
