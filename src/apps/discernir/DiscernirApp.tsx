import { Routes, Route, Navigate } from 'react-router-dom';
import { DiscernirAuthProvider } from './contexts/DiscernirAuthContext';
import { DiscernirLayout } from './components/DiscernirLayout';
import { DiscernirLanding } from './pages/DiscernirLanding';
import { DiscernirAuth } from './pages/DiscernirAuth';
import { DiscernirCaminhoDashboard } from './pages/DiscernirCaminhoDashboard';
import { DiscernirConsent } from './pages/DiscernirConsent';
import { DiscernirApoioEscuta } from './pages/DiscernirApoioEscuta';
import { DiscernirCruzamento } from './pages/DiscernirCruzamento';
import { DiscernirConvite } from './pages/DiscernirConvite';
import { DiscernirPriestDashboard } from './pages/priest/DiscernirPriestDashboard';
import { DiscernirPriestCouples } from './pages/priest/DiscernirPriestCouples';
import { DiscernirPriestInvites } from './pages/priest/DiscernirPriestInvites';
import { DiscernirProtectedRoute } from './components/DiscernirProtectedRoute';
import { IdentityEssencialJourney } from './pages/IdentityEssencialJourney';
import { DiscernirPerfilServico } from './pages/DiscernirPerfilServico';
import { DiscernirDiscernimento } from './pages/DiscernirDiscernimento';
import { DiscernirCoordenacao } from './pages/DiscernirCoordenacao';
import { useDiscernirPilotMode } from './hooks/useDiscernirPilotMode';
import { DiscernirPilotStandby } from './components/DiscernirPilotStandby';

/**
 * DISCERNIR - Pastoral Listening Experience
 * Version: Pilot 0.1 (Controlled Depth MVP)
 * 
 * Served at: discernir.nello.one
 * 
 * Architecture:
 * - Consumes IDENTITY data (no duplication)
 * - Generates "Apoio de Escuta" artifacts
 * - Strict consent-based access
 * - Audit trail for priest access
 */
export default function DiscernirApp() {
  const isPilotMode = useDiscernirPilotMode();

  return (
    <DiscernirAuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<DiscernirLanding />} />
        <Route path="/auth" element={<DiscernirAuth />} />
        <Route path="/convite/:token" element={isPilotMode ? <Navigate to="/" replace /> : <DiscernirConvite />} />
        
        {/* Protected routes - Couples */}
        <Route element={<DiscernirLayout />}>
          <Route
            path="/dashboard"
            element={
              <DiscernirProtectedRoute>
                <DiscernirCaminhoDashboard />
              </DiscernirProtectedRoute>
            }
          />
          <Route
            path="/perfil-servico"
            element={
              <DiscernirProtectedRoute>
                <DiscernirPerfilServico />
              </DiscernirProtectedRoute>
            }
          />
          <Route
            path="/discernimento-espiritual"
            element={
              <DiscernirProtectedRoute>
                <DiscernirDiscernimento />
              </DiscernirProtectedRoute>
            }
          />

          {/* Routes behind pilot gate */}
          <Route 
            path="/consentimento" 
            element={
              <DiscernirProtectedRoute>
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirConsent />}
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/apoio-escuta" 
            element={
              <DiscernirProtectedRoute>
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirApoioEscuta />}
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/cruzamento" 
            element={
              <DiscernirProtectedRoute>
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirCruzamento />}
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/identity-essencial" 
            element={
              <DiscernirProtectedRoute>
                {isPilotMode ? <DiscernirPilotStandby /> : <IdentityEssencialJourney />}
              </DiscernirProtectedRoute>
            } 
          />
        </Route>
        
        {/* Protected routes - Priests */}
        <Route element={<DiscernirLayout isPriest />}>
          <Route 
            path="/padre" 
            element={
              <DiscernirProtectedRoute requiredRole="priest">
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirPriestDashboard />}
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/padre/casais" 
            element={
              <DiscernirProtectedRoute requiredRole="priest">
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirPriestCouples />}
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/padre/convites" 
            element={
              <DiscernirProtectedRoute requiredRole="priest">
                {isPilotMode ? <DiscernirPilotStandby /> : <DiscernirPriestInvites />}
              </DiscernirProtectedRoute>
            } 
          />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DiscernirAuthProvider>
  );
}
