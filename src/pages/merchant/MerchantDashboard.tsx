import React, { useState } from 'react';
import { Activity, CreditCard, GitMerge, Link2, RefreshCw, BarChart3, Settings, LogOut, Menu } from 'lucide-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { OverviewTab } from './tabs/OverviewTab';
import { PaymentsTab } from './tabs/PaymentTab';
import { ProvidersTab } from './tabs/ProviderTab';
import { PaymentLinksTab } from './tabs/PaymentLinksTab';
import { ReconciliationTab } from './tabs/ReconciliationTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { type User } from '../../types';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MerchantDashboardProps {
  userData: User;
  onLogout: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'providers', label: 'Providers', icon: GitMerge },
    { id: 'paymentlinks', label: 'Payment Links', icon: Link2 },
    { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
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
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-auto flex flex-col">
        <Header 
          activeTab={activeTab} 
          menuItems={menuItems} 
          userEmail={userData.email} 
        />

        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};