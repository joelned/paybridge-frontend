import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';

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
        <div className="w-full max-w-sm px-6">
          <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-5">
            <LoadingSkeleton variant="text" className="h-5 w-40 mb-3" />
            <LoadingSkeleton variant="text" className="h-3 w-full mb-2" />
            <LoadingSkeleton variant="text" className="h-3 w-5/6 mb-4" />
            <LoadingSkeleton variant="card" className="h-16 w-full" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-700 font-medium">Loading your account....</p>
            {showSlowHint && (
              <p className="text-xs text-slate-500 mt-1">This is taking longer than usual. Please wait.</p>
            )}
          </div>
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
