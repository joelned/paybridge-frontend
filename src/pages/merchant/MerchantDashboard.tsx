// src/pages/merchant/MerchantDashboard.tsx
import React, { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
import { Activity, CreditCard, GitMerge, Link2, RefreshCw, BarChart3, Settings } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { type User } from '../../types/auth';

// Lazy load tab components for better performance
const OverviewTab = React.lazy(() => import('./tabs/OverviewTab').then(m => ({ default: m.OverviewTab })));
const PaymentsTab = React.lazy(() => import('./tabs/PaymentTab').then(m => ({ default: m.PaymentsTab })));
const ProvidersTab = React.lazy(() => import('./tabs/ProviderTab').then(m => ({ default: m.ProvidersTab })));
const PaymentLinksTab = React.lazy(() => import('./tabs/PaymentLinksTab').then(m => ({ default: m.PaymentLinksTab })));
const ReconciliationTab = React.lazy(() => import('./tabs/ReconciliationTab').then(m => ({ default: m.ReconciliationTab })));
const AnalyticsTab = React.lazy(() => import('./tabs/AnalyticsTab').then(m => ({ default: m.AnalyticsTab })));
const SettingsTab = React.lazy(() => import('./tabs/SettingsTab').then(m => ({ default: m.SettingsTab })));

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MerchantDashboardProps {
  userData: User;
  onLogout: () => void;
}

// Memoized menu items to prevent recreation on every render
const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'providers', label: 'Providers', icon: GitMerge },
  { id: 'paymentlinks', label: 'Payment Links', icon: Link2 },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const TabLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-5" role="status" aria-label="Loading content">
    <div className="relative">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200/60"></div>
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-20"></div>
    </div>
    <div className="text-sm text-slate-600 font-medium tracking-wide">Loading...</div>
    <span className="sr-only">Loading content</span>
  </div>
);

// Error boundary for tab loading failures
class TabErrorBoundary extends React.Component<
  { children: React.ReactNode; tabName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; tabName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100/50">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-center max-w-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Failed to load {this.props.tabName}</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">Something went wrong while loading this section.</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg shadow-blue-500/25 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize from localStorage for better UX
    const saved = localStorage.getItem('sidebar-open');
    return saved ? JSON.parse(saved) : true;
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Enhanced keyboard navigation with arrow keys and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Number for direct tab access
      if (e.ctrlKey || e.metaKey) {
        const tabIndex = parseInt(e.key) - 1;
        if (tabIndex >= 0 && tabIndex < MENU_ITEMS.length) {
          e.preventDefault();
          handleTabChange(MENU_ITEMS[tabIndex].id);
        }
      }
      
      // Arrow key navigation when focused on sidebar
      if (document.activeElement?.closest('aside')) {
        const currentIndex = MENU_ITEMS.findIndex(item => item.id === activeTab);
        let newIndex = currentIndex;
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (currentIndex + 1) % MENU_ITEMS.length;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = currentIndex === 0 ? MENU_ITEMS.length - 1 : currentIndex - 1;
        }
        
        if (newIndex !== currentIndex) {
          handleTabChange(MENU_ITEMS[newIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Preload next likely tabs for better UX
  useEffect(() => {
    const preloadTabs = ['payments', 'providers']; // Most commonly accessed after overview
    if (activeTab === 'overview') {
      preloadTabs.forEach(tabId => {
        const component = getTabComponent(tabId);
        if (component) {
          // Trigger lazy loading
          component().catch(() => {});
        }
      });
    }
  }, [activeTab]);

  // Helper function to get tab component
  const getTabComponent = (tabId: string) => {
    const componentMap: Record<string, () => Promise<any>> = {
      payments: () => import('./tabs/PaymentTab'),
      providers: () => import('./tabs/ProviderTab'),
      paymentlinks: () => import('./tabs/PaymentLinksTab'),
      reconciliation: () => import('./tabs/ReconciliationTab'),
      analytics: () => import('./tabs/AnalyticsTab'),
      settings: () => import('./tabs/SettingsTab')
    };
    return componentMap[tabId];
  };

  // Memoized tab content renderer to prevent unnecessary re-renders
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'providers':
        return <ProvidersTab />;
      case 'paymentlinks':
        return <PaymentLinksTab />;
      case 'reconciliation':
        return <ReconciliationTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab userData={userData} />;
      default:
        return <OverviewTab />;
    }
  }, [activeTab, userData]);

  // Enhanced tab change with smooth transitions and focus management
  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Smooth transition timing
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
      
      // Focus management for accessibility
      const mainContent = document.querySelector('main [role="tabpanel"]');
      if (mainContent) {
        (mainContent as HTMLElement).focus();
      }
    }, 150);
  }, [activeTab]);

  const handleSidebarToggle = useCallback((open: boolean) => {
    setSidebarOpen(open);
  }, []);

  const currentTabLabel = useMemo(() => {
    return MENU_ITEMS.find(item => item.id === activeTab)?.label || 'Overview';
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
        menuItems={MENU_ITEMS}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-hidden flex flex-col" role="main">
        <Header 
          activeTab={activeTab} 
          menuItems={MENU_ITEMS} 
          userEmail={userData.email} 
        />

        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <TabErrorBoundary tabName={currentTabLabel}>
              <Suspense fallback={<TabLoader />}>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isTransitioning 
                      ? 'opacity-0 transform translate-y-3 scale-[0.98]' 
                      : 'opacity-100 transform translate-y-0 scale-100'
                  }`}
                  key={activeTab}
                  role="tabpanel"
                  tabIndex={-1}
                  aria-labelledby={`tab-${activeTab}`}
                >
                  {renderTabContent()}
                </div>
              </Suspense>
            </TabErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
};