// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { MerchantDashboard } from './pages/merchant/MerchantDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LandingPage } from './pages/public/LandingPage';
import { authService } from './services/authService';
import { useEffect, useState } from 'react';
import type { User } from './types/auth';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if a user is logged in on app load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <AppRoutes currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
    </Router>
  );
}

// ✅ This inner component can use useNavigate() safely
function AppRoutes({
  currentUser,
  setCurrentUser,
  onLogout,
}: {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  // 👇 Define this so LandingPage & LoginPage can navigate properly
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />

      <Route
        path="/login"
        element={<LoginPage onLogin={setCurrentUser}/>}
      />

      <Route path="/register" element={<RegisterPage onNavigate={handleNavigate} />} />

      {/* Merchant Dashboard (Protected) */}
      <Route
        path="/merchant"
        element={
          currentUser?.userType === 'MERCHANT'
            ? <MerchantDashboard userData={currentUser} onLogout={onLogout} />
            : <Navigate to="/login" replace />
        }
      />

      {/* Admin Dashboard (Protected) */}
      <Route
        path="/admin"
        element={
          currentUser?.userType === 'ADMIN'
            ? <AdminDashboard userData={currentUser} onLogout={onLogout} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
