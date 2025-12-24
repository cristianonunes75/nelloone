import { Routes, Route } from 'react-router-dom';
import FlowLanding from './pages/FlowLanding';
import FlowAuth from './pages/FlowAuth';
import FlowDashboard from './pages/FlowDashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

/**
 * Nello Flow - Mentor digital com IA para multipotenciais
 * Subdomínio: flow.nello.one
 * 
 * Descrição: Mentor digital com IA para multipotenciais e pessoas dispersas
 * transformarem ideias em ação e renda, usando o Método FLOW.
 */
export default function FlowApp() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<FlowLanding />} />
      <Route path="/auth" element={<FlowAuth />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["cliente", "admin"]}>
            <FlowDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/*"
        element={
          <ProtectedRoute allowedRoles={["cliente", "admin"]}>
            <FlowDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback to landing */}
      <Route path="*" element={<FlowLanding />} />
    </Routes>
  );
}
