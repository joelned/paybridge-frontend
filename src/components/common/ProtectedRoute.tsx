import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'MERCHANT';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const [showSlowHint, setShowSlowHint] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      setShowSlowHint(false);
      return;
    }

    const timer = window.setTimeout(() => setShowSlowHint(true), 2500);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="mx-auto mb-5 w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200/80" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin" />
            <div className="absolute inset-[22px] rounded-full bg-blue-100 animate-pulse" />
          </div>
          <p className="text-sm text-slate-700 font-medium">Loading your account...</p>
          {showSlowHint && (
            <p className="text-xs text-slate-500 mt-1">This is taking longer than usual. Please wait.</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.userType !== requiredRole) {
    const defaultRoute = user?.userType === 'ADMIN' ? '/admin' : '/merchant';
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};
