import { Routes, Route } from 'react-router-dom';
import FlowLanding from './pages/FlowLanding';
import FlowAuth from './pages/FlowAuth';
import FlowOnboarding from './pages/FlowOnboarding';
import FlowDashboardNew from './pages/FlowDashboardNew';
import FlowIdeas from './pages/FlowIdeas';
import FlowOffer from './pages/FlowOffer';
import FlowPlan from './pages/FlowPlan';
import FlowCheckin from './pages/FlowCheckin';
import FlowMentor from './pages/FlowMentor';
import FlowAccount from './pages/FlowAccount';
import { ProtectedRoute } from '@/components/ProtectedRoute';

/**
 * Nello Flow - Mentor digital com IA para multipotenciais
 * Subdomínio: flow.nello.one
 */
export default function FlowApp() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<FlowLanding />} />
      <Route path="/auth" element={<FlowAuth />} />
      
      {/* Protected routes */}
      <Route path="/onboarding" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowDashboardNew />
        </ProtectedRoute>
      } />
      <Route path="/ideias" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowIdeas />
        </ProtectedRoute>
      } />
      <Route path="/oferta" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowOffer />
        </ProtectedRoute>
      } />
      <Route path="/plano" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowPlan />
        </ProtectedRoute>
      } />
      <Route path="/checkin" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowCheckin />
        </ProtectedRoute>
      } />
      <Route path="/mentor" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowMentor />
        </ProtectedRoute>
      } />
      <Route path="/conta" element={
        <ProtectedRoute allowedRoles={["cliente", "admin"]}>
          <FlowAccount />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<FlowLanding />} />
    </Routes>
  );
}
