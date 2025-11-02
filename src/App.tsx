import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PerformanceProvider } from './contexts/PerformanceContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { PerformanceMonitor } from './utils/performance';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })));
const EmailVerificationPage = React.lazy(() => import('./pages/public/EmailVerificationPage').then(m => ({ default: m.EmailVerificationPage })));
const MerchantDashboard = React.lazy(() => import('./pages/merchant/MerchantDashboard').then(m => ({ default: m.MerchantDashboard })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const LandingPage = React.lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));

// Optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Performance-optimized loading fallback
const PageLoadingFallback = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSkeleton variant="card" className="w-64 h-32" />
    </div>
  </div>
));

PageLoadingFallback.displayName = 'PageLoadingFallback';

function App() {
  React.useEffect(() => {
    PerformanceMonitor.mark('app-init');
  }, []);

  return (
    <PerformanceProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ModalContextProvider>
            <AuthProvider>
              <Router>
                <Suspense fallback={<PageLoadingFallback />}>
                  <AppRoutes />
                </Suspense>
              </Router>
            </AuthProvider>
          </ModalContextProvider>
        </ToastProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </PerformanceProvider>
  );
}

const AppRoutes = React.memo(() => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = React.useCallback((page: string) => {
    navigate(`/${page}`);
  }, [navigate]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LandingPage onNavigate={handleNavigate} />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <LoginPage />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <RegisterPage onNavigate={handleNavigate} />
        </Suspense>
      } />
      <Route path="/verify-email" element={
        <Suspense fallback={<PageLoadingFallback />}>
          <EmailVerificationPage />
        </Suspense>
      } />

      {/* Protected routes */}
      <Route
        path="/merchant/*"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <Suspense fallback={<PageLoadingFallback />}>
              <MerchantDashboard userData={user!} onLogout={logout} />
            </Suspense>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Suspense fallback={<PageLoadingFallback />}>
              <AdminDashboard userData={user!} onLogout={logout} />
            </Suspense>
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
  );
});

AppRoutes.displayName = 'AppRoutes';

export default App; 