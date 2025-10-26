// src/pages/merchant/MerchantDashboard.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Activity, CreditCard, GitMerge, Link2, RefreshCw, BarChart3, Settings } from 'lucide-react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { BreadcrumbNavigation } from '../../components/common/BreadcrumbNavigation';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useTabHistory } from '../../hooks/useTabHistory';
import { type User } from '../../types/auth';

// Direct imports instead of lazy loading to avoid import issues
import { OverviewTab } from './tabs/OverviewTab';
import { PaymentsTab } from './tabs/PaymentTab';
import { ProvidersTab } from './tabs/ProviderTab';
import { PaymentLinksTab } from './tabs/PaymentLinksTab';
import { ReconciliationTab } from './tabs/ReconciliationTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SettingsTab } from './tabs/SettingsTab';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar-open');
    return saved ? JSON.parse(saved) : true;
  });

  // Get current tab from URL with validation
  const getCurrentTab = () => {
    const path = location.pathname.split('/')[2] || 'overview';
    const validTab = MENU_ITEMS.find(item => item.id === path);
    return validTab ? path : 'overview';
  };

  const activeTab = getCurrentTab();
  const { addToHistory, getRecentTabs } = useTabHistory();

  // Track tab visits
  useEffect(() => {
    addToHistory(activeTab);
  }, [activeTab, addToHistory]);



  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Enhanced tab change with smooth transitions and focus management
  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Navigate to new tab URL
    navigate(`/merchant/${tab}`, { replace: false });
    
    // Smooth transition timing
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Focus management for accessibility
      const mainContent = document.querySelector('main [role="tabpanel"]');
      if (mainContent) {
        (mainContent as HTMLElement).focus();
      }
    }, 150);
  }, [activeTab, navigate]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 150);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSidebarToggle = useCallback((open: boolean) => {
    setSidebarOpen(open);
  }, []);

  const currentTabLabel = useMemo(() => {
    return MENU_ITEMS.find(item => item.id === activeTab)?.label || 'Overview';
  }, [activeTab]);

  // Update page title based on current tab
  usePageTitle(currentTabLabel);

  // Add keyboard shortcuts for tab navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + number for direct tab access
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const tabIndex = parseInt(e.key) - 1;
        if (tabIndex >= 0 && tabIndex < MENU_ITEMS.length) {
          e.preventDefault();
          handleTabChange(MENU_ITEMS[tabIndex].id);
        }
      }
      
      // Alt + Left/Right for tab navigation
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const currentIndex = MENU_ITEMS.findIndex(item => item.id === activeTab);
        let newIndex;
        
        if (e.key === 'ArrowRight') {
          newIndex = (currentIndex + 1) % MENU_ITEMS.length;
        } else {
          newIndex = currentIndex === 0 ? MENU_ITEMS.length - 1 : currentIndex - 1;
        }
        
        handleTabChange(MENU_ITEMS[newIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleTabChange]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
        menuItems={MENU_ITEMS}
        recentTabs={getRecentTabs(activeTab)}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-hidden flex flex-col" role="main">
        <Header 
          activeTab={activeTab} 
          menuItems={MENU_ITEMS} 
          userEmail={userData.email}
          userData={userData}
          onLogout={onLogout}
        />
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <BreadcrumbNavigation 
              items={[
                { label: 'Dashboard', onClick: () => handleTabChange('overview') },
                { label: currentTabLabel }
              ]}
              className="mb-6"
            />
            <TabErrorBoundary tabName={currentTabLabel}>
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isTransitioning 
                    ? 'opacity-0 transform translate-y-3 scale-[0.98]' 
                    : 'opacity-100 transform translate-y-0 scale-100'
                }`}
                role="tabpanel"
                tabIndex={-1}
                aria-labelledby={`tab-${activeTab}`}
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/merchant/overview" replace />} />
                  <Route path="/overview" element={<OverviewTab key="overview" />} />
                  <Route path="/payments" element={<PaymentsTab key="payments" />} />
                  <Route path="/providers" element={<ProvidersTab key="providers" />} />
                  <Route path="/paymentlinks" element={<PaymentLinksTab key="paymentlinks" />} />
                  <Route path="/reconciliation" element={<ReconciliationTab key="reconciliation" />} />
                  <Route path="/analytics" element={<AnalyticsTab key="analytics" />} />
                  <Route path="/settings" element={<SettingsTab key="settings" userData={userData} />} />
                  <Route path="*" element={<Navigate to="/merchant/overview" replace />} />
                </Routes>
              </div>
            </TabErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
};