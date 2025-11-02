import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { EmailVerificationPage } from './pages/public/EmailVerificationPage';
import { MerchantDashboard } from './pages/merchant/MerchantDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LandingPage } from './pages/public/LandingPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';

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

function AppRoutes() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage onNavigate={handleNavigate} />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Protected routes */}
      <Route
        path="/merchant/*"
        element={
          <ProtectedRoute requiredRole="MERCHANT">
            <MerchantDashboard userData={user!} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard userData={user!} onLogout={logout} />
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
}

export default App; 