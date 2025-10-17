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
import NotFound from "./pages/NotFound";

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
            <Route
              path="/cliente"
              element={
                <ProtectedRoute allowedRoles={["cliente"]}>
                  <Cliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/perfil"
              element={
                <ProtectedRoute allowedRoles={["cliente"]}>
                  <ClientePerfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/test-execution/:testId/:userTestId"
              element={
                <ProtectedRoute allowedRoles={["cliente"]}>
                  <TestExecution />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/test-results/:userTestId"
              element={
                <ProtectedRoute allowedRoles={["cliente"]}>
                  <TestResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fotografo"
              element={
                <ProtectedRoute allowedRoles={["fotografo"]}>
                  <Fotografo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
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
