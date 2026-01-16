import { Routes, Route, Navigate } from 'react-router-dom';
import { InstitutionalLanding } from './pages/InstitutionalLanding';

/**
 * MainApp - Nello Ecosystem Landing
 * Served at: www.nello.one / nello.one
 * 
 * This is the institutional landing page presenting the complete
 * Nello ecosystem (Life, One, Flow, Business).
 */
export default function MainApp() {
  return (
    <Routes>
      <Route path="/" element={<InstitutionalLanding />} />
      {/* Redirect old routes to appropriate apps */}
      <Route path="/auth" element={<Navigate to="https://one.nello.one/auth" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
