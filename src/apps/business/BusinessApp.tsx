import { Routes, Route, Navigate } from 'react-router-dom';
import BusinessLanding from './pages/BusinessLanding';
import BusinessAuth from './pages/BusinessAuth';
import BusinessResetPassword from './pages/BusinessResetPassword';
import BusinessOnboarding from './pages/BusinessOnboarding';
import BusinessConsent from './pages/BusinessConsent';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessTeam from './pages/BusinessTeam';

import BusinessSettings from './pages/BusinessSettings';
import BusinessAcceptInvite from './pages/BusinessAcceptInvite';
import BusinessCollaboratorRedirect from './pages/BusinessCollaboratorRedirect';
import BusinessMySpace from './pages/BusinessMySpace';

import BusinessHiringResults from './pages/BusinessHiringResults';
import BusinessHiringAssessment from './pages/BusinessHiringAssessment';
import BusinessJobs from './pages/BusinessJobs';
import BusinessJobDetail from './pages/BusinessJobDetail';
import BusinessJobPublic from './pages/BusinessJobPublic';
import BusinessApplicationConfirm from './pages/BusinessApplicationConfirm';
import BusinessCandidates from './pages/BusinessCandidates';
import BusinessBilling from './pages/BusinessBilling';
import BusinessWhatsApp from './pages/BusinessWhatsApp';
import BusinessTeamComparison from './pages/BusinessTeamComparison';
import BusinessTalentPoolPublic from './pages/BusinessTalentPoolPublic';
import { BusinessProtectedRoute } from './components/BusinessProtectedRoute';
import { isFeatureEnabled } from './config/featureFlags';

// Praxis imports
import PraxisLanding from './pages/PraxisLanding';
import PraxisAuth from './pages/PraxisAuth';
import PraxisOnboarding from './pages/PraxisOnboarding';
import PraxisDashboard from './pages/PraxisDashboard';
import PraxisClientDetail from './pages/PraxisClientDetail';
import { OperatorProvider } from './hooks/useOperatorWorkspace';

/**
 * Nello Hiring - B2B Platform for Candidate Behavioral Assessment
 * + Nello Praxis - Professional Client Accompaniment
 * Subdomain: business.nello.one
 */
export default function BusinessApp() {
  const praxisEnabled = isFeatureEnabled('PRAXIS_MODULE');
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<BusinessLanding />} />
      <Route path="/auth" element={<BusinessAuth />} />
      <Route path="/reset-password" element={<BusinessResetPassword />} />
      <Route path="/invite/:token" element={<BusinessAcceptInvite />} />
      
      {/* Public job routes */}
      <Route path="/vaga/:slug" element={<BusinessJobPublic />} />
      <Route path="/talentos/:slug" element={<BusinessTalentPoolPublic />} />
      <Route path="/confirmar/:token" element={<BusinessApplicationConfirm />} />
      
      {/* Billing / Paywall */}
      <Route path="/billing" element={
        <BusinessProtectedRoute requiredRole="company_admin" enforceTrial={false}>
          <BusinessBilling />
        </BusinessProtectedRoute>
      } />
      
      {/* Collaborator consent route */}
      <Route path="/consent" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessConsent />
        </BusinessProtectedRoute>
      } />
      
      {/* Company Admin routes - all enforce trial */}
      <Route path="/onboarding" element={
        <BusinessProtectedRoute requiredRole="company_admin" enforceTrial={false}>
          <BusinessOnboarding />
        </BusinessProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessDashboard />
        </BusinessProtectedRoute>
      } />
      <Route path="/team" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessTeam />
        </BusinessProtectedRoute>
      } />
      {/* Redirect old /invite to /team?tab=invite */}
      <Route path="/invite" element={<Navigate to="/team?tab=invite" replace />} />
      <Route path="/settings" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessSettings />
        </BusinessProtectedRoute>
      } />
      {/* Redirect old /hiring to /candidates?tab=direct */}
      <Route path="/hiring" element={<Navigate to="/candidates?tab=direct" replace />} />
      <Route path="/hiring/:candidateId" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessHiringResults />
        </BusinessProtectedRoute>
      } />
      
      {/* Jobs module routes */}
      <Route path="/jobs" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessJobs />
        </BusinessProtectedRoute>
      } />
      <Route path="/jobs/:jobId" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessJobDetail />
        </BusinessProtectedRoute>
      } />
      
      {/* Unified Candidates view */}
      <Route path="/candidates" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessCandidates />
        </BusinessProtectedRoute>
      } />
      
      {/* WhatsApp Automation */}
      <Route path="/whatsapp" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessWhatsApp />
        </BusinessProtectedRoute>
      } />
      
      {/* People Strategy hidden while climate/eNPS modules are not active */}
      <Route path="/people-strategy" element={<Navigate to="/team-comparison" replace />} />

      <Route path="/team-comparison" element={
        <BusinessProtectedRoute requiredRole="any">
          <BusinessTeamComparison />
        </BusinessProtectedRoute>
      } />
      
      {/* Reports - DISABLED, redirect to dashboard */}
      <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
      
      {/* Public hiring assessment route - candidates access via token */}
      <Route path="/assessment/:token" element={<BusinessHiringAssessment />} />
      
      {/* Collaborator routes */}
      <Route path="/my-space" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessMySpace />
        </BusinessProtectedRoute>
      } />
      {/* Legacy redirect */}
      <Route path="/my-journey" element={<Navigate to="/my-space" replace />} />
      {/* Old fallback (kept for users that still need to redirect to /cliente) */}
      <Route path="/identity-redirect" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessCollaboratorRedirect />
        </BusinessProtectedRoute>
      } />

      {/* Praxis - Professional Accompaniment Module */}
      {praxisEnabled ? (
        <>
          <Route path="/praxis" element={<PraxisLanding />} />
          <Route path="/praxis/auth" element={<PraxisAuth />} />
          <Route path="/praxis/*" element={
            <OperatorProvider>
              <Routes>
                <Route path="/onboarding" element={<PraxisOnboarding />} />
                <Route path="/dashboard" element={<PraxisDashboard />} />
                <Route path="/clients/:clientId" element={<PraxisClientDetail />} />
              </Routes>
            </OperatorProvider>
          } />
        </>
      ) : (
        <Route path="/praxis/*" element={<Navigate to="/" replace />} />
      )}
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
