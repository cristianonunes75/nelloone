import { Routes, Route, Navigate } from 'react-router-dom';
import { DiscernirAuthProvider } from './contexts/DiscernirAuthContext';
import { DiscernirLayout } from './components/DiscernirLayout';
import { DiscernirLanding } from './pages/DiscernirLanding';
import { DiscernirAuth } from './pages/DiscernirAuth';
import { DiscernirDashboard } from './pages/DiscernirDashboard';
import { DiscernirConsent } from './pages/DiscernirConsent';
import { DiscernirApoioEscuta } from './pages/DiscernirApoioEscuta';
import { DiscernirCruzamento } from './pages/DiscernirCruzamento';
import { DiscernirConvite } from './pages/DiscernirConvite';
import { DiscernirPriestDashboard } from './pages/priest/DiscernirPriestDashboard';
import { DiscernirPriestCouples } from './pages/priest/DiscernirPriestCouples';
import { DiscernirPriestInvites } from './pages/priest/DiscernirPriestInvites';
import { DiscernirProtectedRoute } from './components/DiscernirProtectedRoute';
import { IdentityEssencialJourney } from './pages/IdentityEssencialJourney';

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
  return (
    <DiscernirAuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<DiscernirLanding />} />
        <Route path="/auth" element={<DiscernirAuth />} />
        <Route path="/convite/:token" element={<DiscernirConvite />} />
        
        {/* Protected routes - Couples */}
        <Route element={<DiscernirLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <DiscernirProtectedRoute>
                <DiscernirDashboard />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/consentimento" 
            element={
              <DiscernirProtectedRoute>
                <DiscernirConsent />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/apoio-escuta" 
            element={
              <DiscernirProtectedRoute requiresConsent>
                <DiscernirApoioEscuta />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/cruzamento" 
            element={
              <DiscernirProtectedRoute requiresConsent requiresCouple>
                <DiscernirCruzamento />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/identity-essencial" 
            element={
              <DiscernirProtectedRoute>
                <IdentityEssencialJourney />
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
                <DiscernirPriestDashboard />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/padre/casais" 
            element={
              <DiscernirProtectedRoute requiredRole="priest">
                <DiscernirPriestCouples />
              </DiscernirProtectedRoute>
            } 
          />
          <Route 
            path="/padre/convites" 
            element={
              <DiscernirProtectedRoute requiredRole="priest">
                <DiscernirPriestInvites />
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
