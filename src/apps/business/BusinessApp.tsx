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
import { BusinessProtectedRoute } from './components/BusinessProtectedRoute';

/**
 * Nello One Business - B2B Platform for Team Self-Knowledge
 * Subdomain: business.nello.one
 * 
 * Enterprise solution for companies to apply self-knowledge tests
 * to their teams with consolidated reports and privacy-first approach.
 * 
 * ARCHITECTURE:
 * - Collaborators execute tests in the CORE (/cliente) - single source of truth
 * - Business only handles: company association, invites, aggregated insights
 * - No duplicate journey logic - Business READS from Core
 */
export default function BusinessApp() {
  return (
    <Routes>
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
      
      {/* Public hiring assessment route - candidates access via token */}
      <Route path="/assessment/:token" element={<BusinessHiringAssessment />} />
      
      {/* Collaborator routes - redirect to Core with company context */}
      <Route path="/my-journey" element={
        <BusinessProtectedRoute requiredRole="collaborator">
          <BusinessCollaboratorRedirect />
        </BusinessProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}