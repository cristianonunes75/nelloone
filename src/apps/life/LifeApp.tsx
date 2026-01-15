import { Routes, Route } from 'react-router-dom';
import LifeLanding from '@/apps/life/pages/LifeLanding';
import LifeAuth from '@/apps/life/pages/LifeAuth';
import LifeDashboard from '@/apps/life/pages/LifeDashboard';
import { LifeProtectedRoute } from '@/apps/life/components/LifeProtectedRoute';

/**
 * Nello Life - Aplicativo de organização de vida
 * Subdomínio: life.nello.one
 * 
 * Descrição: Plataforma para organização da vida, hábitos, 
 * espiritualidade e equilíbrio pessoal.
 */
export default function LifeApp() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LifeLanding />} />
      <Route path="/auth" element={<LifeAuth />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <LifeProtectedRoute>
            <LifeDashboard />
          </LifeProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<LifeLanding />} />
    </Routes>
  );
}
