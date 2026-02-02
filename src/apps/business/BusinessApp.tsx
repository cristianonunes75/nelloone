import { Routes, Route, Navigate } from 'react-router-dom';
import BusinessLanding from './pages/BusinessLanding';
import BusinessAuth from './pages/BusinessAuth';
import BusinessOnboarding from './pages/BusinessOnboarding';
import BusinessConsent from './pages/BusinessConsent';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessTeam from './pages/BusinessTeam';
import BusinessInvite from './pages/BusinessInvite';
import BusinessReports from './pages/BusinessReports';
import BusinessSettings from './pages/BusinessSettings';
import BusinessAcceptInvite from './pages/BusinessAcceptInvite';
import BusinessCollaboratorRedirect from './pages/BusinessCollaboratorRedirect';
import BusinessHiring from './pages/BusinessHiring';
import BusinessHiringResults from './pages/BusinessHiringResults';
import BusinessHiringAssessment from './pages/BusinessHiringAssessment';
import BusinessJobs from './pages/BusinessJobs';
import BusinessJobDetail from './pages/BusinessJobDetail';
import BusinessJobPublic from './pages/BusinessJobPublic';
import BusinessApplicationConfirm from './pages/BusinessApplicationConfirm';
import BusinessCandidates from './pages/BusinessCandidates';
import { BusinessProtectedRoute } from './components/BusinessProtectedRoute';
import { isFeatureEnabled } from './config/featureFlags';

// Praxis imports - DISABLED via feature flag
import PraxisLanding from './pages/PraxisLanding';
import PraxisAuth from './pages/PraxisAuth';
import PraxisOnboarding from './pages/PraxisOnboarding';
import PraxisDashboard from './pages/PraxisDashboard';
import PraxisClientDetail from './pages/PraxisClientDetail';
import { PraxisAuthProvider } from './hooks/usePraxisAuth';

/**
 * Nello Hiring - B2B Platform for Candidate Behavioral Assessment
 * Subdomain: business.nello.one
 * 
 * STRATEGIC DECISION (Post-Audit):
 * - Only the HIRING module is commercially viable
 * - Praxis, Team Insights, and Reports are DISABLED
 * - Focus: Create jobs → Candidates take DISC/Temperaments → Compare with ideal profile
 */
export default function BusinessApp() {
  const praxisEnabled = isFeatureEnabled('PRAXIS_MODULE');
  return (
    <Routes>
      {/* ========== ENTERPRISE MODE (existing) ========== */}
      {/* Public routes */}
      <Route path="/" element={<BusinessLanding />} />
      <Route path="/auth" element={<BusinessAuth />} />
      <Route path="/invite/:token" element={<BusinessAcceptInvite />} />
      
      {/* Public job routes */}
      <Route path="/vaga/:slug" element={<BusinessJobPublic />} />
      <Route path="/confirmar/:token" element={<BusinessApplicationConfirm />} />
      
      {/* Collaborator consent route */}
      <Route path="/consent" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessConsent />
        </BusinessProtectedRoute>
      } />
      
      {/* Company Admin routes */}
      <Route path="/onboarding" element={
        <BusinessProtectedRoute requiredRole="company_admin">
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
      <Route path="/invite" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessInvite />
        </BusinessProtectedRoute>
      } />
      <Route path="/reports" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessReports />
        </BusinessProtectedRoute>
      } />
      <Route path="/settings" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessSettings />
        </BusinessProtectedRoute>
      } />
      <Route path="/hiring" element={
        <BusinessProtectedRoute requiredRole="company_admin">
          <BusinessHiring />
        </BusinessProtectedRoute>
      } />
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
      
      {/* Public hiring assessment route - candidates access via token */}
      <Route path="/assessment/:token" element={<BusinessHiringAssessment />} />
      
      {/* Collaborator routes - redirect to Core with company context */}
      <Route path="/my-journey" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessCollaboratorRedirect />
        </BusinessProtectedRoute>
      } />

      {/* ========== PRAXIS MODE - DISABLED ========== */}
      {/* Praxis routes redirect to landing when feature is disabled */}
      {praxisEnabled ? (
        <>
          <Route path="/praxis" element={<PraxisLanding />} />
          <Route path="/praxis/auth" element={<PraxisAuth />} />
          <Route path="/praxis/*" element={
            <PraxisAuthProvider>
              <Routes>
                <Route path="/onboarding" element={<PraxisOnboarding />} />
                <Route path="/dashboard" element={<PraxisDashboard />} />
                <Route path="/clients/:clientId" element={<PraxisClientDetail />} />
              </Routes>
            </PraxisAuthProvider>
          } />
        </>
      ) : (
        // Praxis disabled - redirect all praxis routes to main landing
        <Route path="/praxis/*" element={<Navigate to="/" replace />} />
      )}
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}