import { Routes, Route, Navigate } from 'react-router-dom';
import { BibliotecaAccessProvider } from './contexts/BibliotecaAccessContext';
import { BibliotecaLayout } from './components/BibliotecaLayout';
import { BibliotecaProtectedRoute } from './components/BibliotecaProtectedRoute';
import { BibliotecaHome } from './pages/BibliotecaHome';
import { BibliotecaFolder } from './pages/BibliotecaFolder';
import { BibliotecaDocument } from './pages/BibliotecaDocument';
import { BibliotecaBusca } from './pages/BibliotecaBusca';
import { BibliotecaAcesso } from './pages/BibliotecaAcesso';

export default function BibliotecaRoutes() {
  return (
    <BibliotecaAccessProvider>
      <Routes>
        <Route element={<BibliotecaLayout />}>
          <Route
            index
            element={
              <BibliotecaProtectedRoute>
                <BibliotecaHome />
              </BibliotecaProtectedRoute>
            }
          />
          <Route
            path="pasta/:id"
            element={
              <BibliotecaProtectedRoute>
                <BibliotecaFolder />
              </BibliotecaProtectedRoute>
            }
          />
          <Route
            path="doc/:id"
            element={
              <BibliotecaProtectedRoute>
                <BibliotecaDocument />
              </BibliotecaProtectedRoute>
            }
          />
          <Route
            path="busca"
            element={
              <BibliotecaProtectedRoute>
                <BibliotecaBusca />
              </BibliotecaProtectedRoute>
            }
          />
          <Route
            path="acesso"
            element={
              <BibliotecaProtectedRoute requireOwner>
                <BibliotecaAcesso />
              </BibliotecaProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/biblioteca" replace />} />
      </Routes>
    </BibliotecaAccessProvider>
  );
}
