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
import ArquetiposMarca from "./pages/tests/ArquetiposMarca";
import DISC from "./pages/tests/DISC";
import MBTI from "./pages/tests/MBTI";
import Eneagrama from "./pages/tests/Eneagrama";
import Temperamentos from "./pages/tests/Temperamentos";
import InteligenciasMultiplas from "./pages/tests/InteligenciasMultiplas";
import LinguagensAmor from "./pages/tests/LinguagensAmor";
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
    
    {/* Test detail pages - PT */}
    <Route path="/teste-arquetipos" element={<ArquetiposMarca />} />
    <Route path="/teste-disc" element={<DISC />} />
    <Route path="/teste-mbti" element={<MBTI />} />
    <Route path="/teste-eneagrama" element={<Eneagrama />} />
    <Route path="/teste-temperamentos" element={<Temperamentos />} />
    <Route path="/teste-inteligencias" element={<InteligenciasMultiplas />} />
    <Route path="/teste-linguagens" element={<LinguagensAmor />} />
    
    {/* Test detail pages - EN */}
    <Route path="/test-archetypes" element={<ArquetiposMarca />} />
    <Route path="/test-disc" element={<DISC />} />
    <Route path="/test-mbti" element={<MBTI />} />
    <Route path="/test-enneagram" element={<Eneagrama />} />
    <Route path="/test-temperaments" element={<Temperamentos />} />
    <Route path="/test-intelligences" element={<InteligenciasMultiplas />} />
    <Route path="/test-love-languages" element={<LinguagensAmor />} />
    
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
              <Routes>
                {/* English routes with /en prefix */}
                <Route path="/en/*" element={
                  <LanguageRoute>
                    <AppRoutes />
                  </LanguageRoute>
                } />
                
                {/* Default routes (Portuguese / Brazil) */}
                <Route path="/*" element={<AppRoutes />} />
              </Routes>
            </AuthProvider>
          </SimulationProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
