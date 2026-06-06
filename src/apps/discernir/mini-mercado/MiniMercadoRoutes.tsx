import { Routes, Route, Navigate } from 'react-router-dom';
import { MiniMercadoProvider } from './contexts/MiniMercadoContext';
import { MiniMercadoLayout } from './components/MiniMercadoLayout';
import { MiniMercadoProtectedRoute } from './components/MiniMercadoProtectedRoute';
import { MiniMercadoOnboarding } from './pages/MiniMercadoOnboarding';
import { MiniMercadoBalcao } from './pages/MiniMercadoBalcao';
import { MiniMercadoServos } from './pages/MiniMercadoServos';
import { MiniMercadoProdutos } from './pages/MiniMercadoProdutos';
import { MiniMercadoFechamento } from './pages/MiniMercadoFechamento';
import { MiniMercadoImport } from './pages/MiniMercadoImport';

export default function MiniMercadoRoutes() {
  return (
    <MiniMercadoProvider>
      <Routes>
        <Route
          path="/"
          element={
            <MiniMercadoProtectedRoute requireEvent={false}>
              <MiniMercadoOnboarding />
            </MiniMercadoProtectedRoute>
          }
        />
        <Route element={<MiniMercadoLayout />}>
          <Route
            path="balcao"
            element={
              <MiniMercadoProtectedRoute>
                <MiniMercadoBalcao />
              </MiniMercadoProtectedRoute>
            }
          />
          <Route
            path="servos"
            element={
              <MiniMercadoProtectedRoute>
                <MiniMercadoServos />
              </MiniMercadoProtectedRoute>
            }
          />
          <Route
            path="importar"
            element={
              <MiniMercadoProtectedRoute requireGestor>
                <MiniMercadoImport />
              </MiniMercadoProtectedRoute>
            }
          />
          <Route
            path="produtos"
            element={
              <MiniMercadoProtectedRoute requireGestor>
                <MiniMercadoProdutos />
              </MiniMercadoProtectedRoute>
            }
          />
          <Route
            path="fechamento"
            element={
              <MiniMercadoProtectedRoute requireGestor>
                <MiniMercadoFechamento />
              </MiniMercadoProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/mini-mercado" replace />} />
      </Routes>
    </MiniMercadoProvider>
  );
}
