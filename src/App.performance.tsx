import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PerformanceProvider } from './contexts/PerformanceContext';
import { OptimizedAuthProvider } from './contexts/OptimizedAuthContext';
import { ModalProvider } from './components/modals/ModalProvider';
import { ToastProvider } from './contexts/ToastContext';
import { AppRoutes } from './AppRoutes';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { PerformanceMonitor } from './utils/performance';

// Optimized query client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Performance-optimized app loading fallback
const AppLoadingFallback = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <LoadingSkeleton variant="card" className="w-64 h-32" />
        <p className="text-sm text-gray-500">Loading PayBridge...</p>
      </div>
    </div>
  </div>
));

AppLoadingFallback.displayName = 'AppLoadingFallback';

export const PerformanceOptimizedApp = React.memo(() => {
  React.useEffect(() => {
    // Initialize performance monitoring
    PerformanceMonitor.mark('app-init');
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const logMetrics = () => {
        const metrics = PerformanceMonitor.getMetrics();
        if (Object.keys(metrics).length > 0) {
          console.table(metrics);
        }
      };
      
      // Log metrics every 30 seconds
      const interval = setInterval(logMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <PerformanceProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <OptimizedAuthProvider
            user={null} // This would come from your auth state
            isLoading={false}
            onLogin={async () => {}} // Your login handler
            onLogout={() => {}} // Your logout handler
            onUpdateUser={() => {}} // Your update user handler
          >
            <ToastProvider>
              <ModalProvider>
                <Suspense fallback={<AppLoadingFallback />}>
                  <AppRoutes />
                </Suspense>
              </ModalProvider>
            </ToastProvider>
          </OptimizedAuthProvider>
        </BrowserRouter>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </PerformanceProvider>
  );
});

PerformanceOptimizedApp.displayName = 'PerformanceOptimizedApp';