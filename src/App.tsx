import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { lazy, Suspense, memo } from 'react';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { PageTransition } from './components/common/PageTransition';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })));
const EmailVerificationPage = lazy(() => import('./pages/public/EmailVerificationPage').then(m => ({ default: m.EmailVerificationPage })));
const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard').then(m => ({ default: m.MerchantDashboard })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

function App() {
  return (
    <ToastProvider>
      <ModalContextProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ModalContextProvider>
    </ToastProvider>
  );
}

const AppRoutes = memo(() => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><LandingPage onNavigate={handleNavigate} /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage onNavigate={handleNavigate} /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><EmailVerificationPage /></PageTransition>} />

        {/* Protected routes */}
        <Route
          path="/merchant/*"
          element={
            <ProtectedRoute requiredRole="MERCHANT">
              <PageTransition><MerchantDashboard userData={user!} onLogout={logout} /></PageTransition>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PageTransition><AdminDashboard userData={user!} onLogout={logout} /></PageTransition>
            </ProtectedRoute>
          }
        />

        {/* Redirect authenticated users to their dashboard */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to={user.userType === 'ADMIN' ? '/admin/overview' : '/merchant/overview'} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
});

export default App; 