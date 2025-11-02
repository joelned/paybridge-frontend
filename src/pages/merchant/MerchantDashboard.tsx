// src/pages/merchant/MerchantDashboard.tsx - Refactored for consistent UI/UX
import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Activity, CreditCard, GitMerge, Link2, RefreshCw, BarChart3, Settings, Loader2, AlertCircle } from 'lucide-react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { BreadcrumbNavigation } from '../../components/common/BreadcrumbNavigation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useTabHistory } from '../../hooks/useTabHistory';
import type { User } from '../../types/auth';

// Optimized lazy loading with preload hints
const OverviewTab = lazy(() => import('./tabs/OverviewTab'));
const PaymentsTab = lazy(() => import('./tabs/PaymentTab'));
const ProvidersTab = lazy(() => import('./tabs/ProviderTab'));
const PaymentLinksTab = lazy(() => import('./tabs/PaymentLinksTab'));
const ReconciliationTab = lazy(() => import('./tabs/ReconciliationTab'));
const AnalyticsTab = lazy(() => import('./tabs/AnalyticsTab'));
const SettingsTab = lazy(() => import('./tabs/SettingsTab'));

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface Props {
  userData: User;
  onLogout: () => void;
}

// Centralized menu configuration for consistency
const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'providers', label: 'Providers', icon: GitMerge },
  { id: 'paymentlinks', label: 'Payment Links', icon: Link2 },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

// Enhanced loading component with consistent styling
const TabLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[500px] bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60">
    <div className="text-center space-y-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <Loader2 className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={20} />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-slate-700">Loading content...</p>
        <p className="text-sm text-slate-500">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  </div>
);

// Professional error component with consistent design
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-[500px] bg-white/50 backdrop-blur-sm rounded-2xl border border-red-200/60">
    <div className="text-center space-y-6 p-8 max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="text-red-600" size={32} />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900">Something went wrong</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{error.message}</p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <RefreshCw size={16} />
        Reload Dashboard
      </button>
    </div>
  </div>
);

export const MerchantDashboard = ({ userData, onLogout }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Persistent sidebar state with improved initialization
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('paybridge-sidebar-open');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true; // Fallback to open state
    }
  });
  
  // Navigation state for smooth transitions
  const [isNavigating, setIsNavigating] = useState(false);

  // Optimized tab detection with memoization
  const getCurrentTab = useCallback(() => {
    const pathSegments = location.pathname.split('/');
    const tabFromPath = pathSegments[2];
    const validTabs = MENU_ITEMS.map(item => item.id);
    return validTabs.includes(tabFromPath) ? tabFromPath : 'overview';
  }, [location.pathname]);

  const activeTab = getCurrentTab();
  const { addToHistory, getRecentTabs } = useTabHistory();

  // Track tab history for better UX
  useEffect(() => {
    addToHistory(activeTab);
  }, [activeTab, addToHistory]);

  // Persist sidebar state with error handling
  useEffect(() => {
    try {
      localStorage.setItem('paybridge-sidebar-open', JSON.stringify(sidebarOpen));
    } catch (error) {
      console.warn('Failed to save sidebar state:', error);
    }
  }, [sidebarOpen]);

  // Smooth navigation with loading states
  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab || isNavigating) return;
    
    setIsNavigating(true);
    
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      navigate(`/merchant/${tab}`, { replace: false });
      
      // Reset navigation state after a brief delay
      setTimeout(() => setIsNavigating(false), 150);
    });
  }, [activeTab, navigate, isNavigating]);

  // Memoized current tab label for performance
  const currentTabLabel = useMemo(() => {
    return MENU_ITEMS.find(item => item.id === activeTab)?.label || 'Overview';
  }, [activeTab]);

  // Set page title for better SEO and UX
  usePageTitle(`${currentTabLabel} - PayBridge Dashboard`);

  // Enhanced keyboard shortcuts with better accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in form elements
      const isTyping = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement ||
                      e.target instanceof HTMLSelectElement ||
                      (e.target as HTMLElement)?.contentEditable === 'true';
      
      if (isTyping) return;

      // Alt + Number shortcuts for quick navigation
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const key = e.key;
        if (key >= '1' && key <= '7') {
          const tabIndex = parseInt(key) - 1;
          if (tabIndex < MENU_ITEMS.length) {
            e.preventDefault();
            handleTabChange(MENU_ITEMS[tabIndex].id);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleTabChange]);

  return (
    // Main dashboard container with consistent background and no layout shifts
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 overflow-hidden">
      {/* Sidebar with consistent spacing and transitions */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={MENU_ITEMS}
        recentTabs={getRecentTabs(activeTab)}
        onLogout={onLogout}
      />

      {/* Main content area with proper flex layout */}
      <main className="flex-1 overflow-hidden flex flex-col min-w-0" role="main">
        {/* Header with consistent styling */}
        <Header 
          activeTab={activeTab} 
          menuItems={MENU_ITEMS} 
          userEmail={userData.email}
          userData={userData}
          onLogout={onLogout}
        />
        
        {/* Content area with optimized scrolling and spacing */}
        <div className="flex-1 overflow-auto bg-transparent">
          <div className="min-h-full">
            {/* Container with consistent max-width and padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              {/* Breadcrumb navigation with consistent spacing */}
              <div className="mb-8">
                <BreadcrumbNavigation 
                  items={[
                    { label: 'Dashboard', onClick: () => handleTabChange('overview') },
                    { label: currentTabLabel }
                  ]}
                  className=""
                />
              </div>
              
              {/* Tab content with error boundary and loading states */}
              <ErrorBoundary fallback={ErrorFallback}>
                <Suspense fallback={<TabLoadingFallback />}>
                  {/* Content wrapper with smooth transitions */}
                  <div 
                    role="tabpanel" 
                    tabIndex={-1} 
                    aria-labelledby={`tab-${activeTab}`}
                    className={`transition-opacity duration-200 ${
                      isNavigating ? 'opacity-75' : 'opacity-100'
                    }`}
                  >
                    <Routes>
                      <Route path="/" element={<Navigate to="/merchant/overview" replace />} />
                      <Route path="/overview" element={<OverviewTab />} />
                      <Route path="/payments" element={<PaymentsTab />} />
                      <Route path="/providers" element={<ProvidersTab />} />
                      <Route path="/paymentlinks" element={<PaymentLinksTab />} />
                      <Route path="/reconciliation" element={<ReconciliationTab />} />
                      <Route path="/analytics" element={<AnalyticsTab />} />
                      <Route path="/settings" element={<SettingsTab userData={userData} />} />
                      <Route path="*" element={<Navigate to="/merchant/overview" replace />} />
                    </Routes>
                  </div>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
