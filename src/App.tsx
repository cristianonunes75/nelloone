import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Cliente from "./pages/Cliente";
import ClientePerfil from "./pages/ClientePerfil";
import TestExecution from "./pages/TestExecution";
import TestResults from "./pages/TestResults";
import Fotografo from "./pages/Fotografo";
import Admin from "./pages/Admin";
import Influence from "./pages/Influence";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/influence" element={<Influence />} />
            <Route path="/termos" element={<TermsOfService />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route
              path="/cliente"
              element={
                <ProtectedRoute allowedRoles={["cliente", "admin"]}>
                  <Cliente />
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
              path="/cliente/test-execution/:testId/:userTestId"
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
