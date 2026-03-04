import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Activity, Workflow, CreditCard, BarChart3, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { Routes, Route, Navigate, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { BreadcrumbNavigation } from '../../components/common/BreadcrumbNavigation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useTabHistory } from '../../hooks/useTabHistory';
import { LoadingSkeleton, SkipLink, LiveRegion } from '../../components/common';
import { useAnnouncement } from '../../hooks/useAccessibility';
import type { User } from '../../types/auth';

const OverviewTab = lazy(() => import('./tabs/OverviewTab'));
const PaymentsTab = lazy(() => import('./tabs/PaymentTab'));
const ProvidersTab = lazy(() => import('./tabs/ProviderTab'));
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

const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'payments', label: 'Integration', icon: Workflow },
  { id: 'providers', label: 'Providers', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const TabLoadingFallback = () => (
  <div className="space-y-6">
    <LoadingSkeleton variant="stat" className="" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </div>
    <LoadingSkeleton variant="table" rows={5} />
  </div>
);

const ErrorFallback = (error: Error) => (
  <div className="flex items-center justify-center min-h-[500px] bg-white/50 backdrop-blur-sm rounded-2xl border border-red-200/60">
    <div className="text-center space-y-6 p-8 max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="text-red-600" size={32} />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-900">Something went wrong</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{error?.message || 'An error occurred'}</p>
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
  const { announce } = useAnnouncement();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('paybridge-sidebar-open');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isNavigating, setIsNavigating] = useState(false);

  const getCurrentTab = useCallback(() => {
    const match = matchPath('/merchant/:tab/*', location.pathname);
    const tabFromPath = match?.params.tab;
    const validTabs = MENU_ITEMS.map((item) => item.id);
    return tabFromPath && validTabs.includes(tabFromPath) ? tabFromPath : 'overview';
  }, [location.pathname]);

  const activeTab = getCurrentTab();
  const { addToHistory, getRecentTabs } = useTabHistory();

  const currentTabLabel = useMemo(() => {
    return MENU_ITEMS.find((item) => item.id === activeTab)?.label || 'Overview';
  }, [activeTab]);

  useEffect(() => {
    addToHistory(activeTab);
    announce(`Navigated to ${currentTabLabel} section`);
  }, [activeTab, addToHistory, currentTabLabel, announce]);

  useEffect(() => {
    try {
      localStorage.setItem('paybridge-sidebar-open', JSON.stringify(sidebarOpen));
    } catch (error) {
      console.warn('Failed to save sidebar state:', error);
    }
  }, [sidebarOpen]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === activeTab || isNavigating) {
        return;
      }

      setIsNavigating(true);
      requestAnimationFrame(() => {
        navigate(`/merchant/${tab}`, { replace: false });
        setTimeout(() => setIsNavigating(false), 150);
      });
    },
    [activeTab, navigate, isNavigating]
  );

  usePageTitle(`${currentTabLabel} - PayBridge Dashboard`);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.contentEditable === 'true';

      if (isTyping) {
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const key = e.key;
        if (key >= '1' && key <= String(MENU_ITEMS.length)) {
          const tabIndex = parseInt(key, 10) - 1;
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
    <>
      <SkipLink />
      <LiveRegion message={`Current page: ${currentTabLabel}`} />

      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          menuItems={MENU_ITEMS}
          recentTabs={getRecentTabs(activeTab)}
          onLogout={onLogout}
        />

        <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-w-0" role="main" tabIndex={-1}>
          <Header activeTab={activeTab} menuItems={MENU_ITEMS} userEmail={userData.email} userData={userData} onLogout={onLogout} />

          <div className="flex-1 overflow-auto bg-transparent">
            <div className="min-h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="mb-8">
                  <BreadcrumbNavigation
                    items={[
                      { label: 'Dashboard', onClick: () => handleTabChange('overview') },
                      { label: currentTabLabel },
                    ]}
                    className=""
                  />
                </div>

                <ErrorBoundary fallback={ErrorFallback}>
                  <Suspense fallback={<TabLoadingFallback />}>
                    <div
                      role="tabpanel"
                      tabIndex={-1}
                      aria-labelledby={`tab-${activeTab}`}
                      aria-label={`${currentTabLabel} content`}
                      className={`transition-opacity duration-200 ${isNavigating ? 'opacity-75' : 'opacity-100'}`}
                    >
                      <Routes>
                        <Route path="/" element={<Navigate to="/merchant/overview" replace />} />
                        <Route path="/overview" element={<OverviewTab />} />
                        <Route path="/payments" element={<PaymentsTab />} />
                        <Route path="/providers" element={<ProvidersTab />} />
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
    </>
  );
};
