import React from 'react';
import { GitMerge, LogOut, Menu } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  onLogout
}) => {
  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-18'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-full`}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between min-h-[88px]">
        {sidebarOpen && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
              <GitMerge className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">PayBridge</span>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={18} className="text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-sm font-medium ${
              activeTab === item.id
                ? 'bg-primary-50 text-primary-700 shadow-xs'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon 
              size={18} 
              className={`${activeTab === item.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} transition-colors flex-shrink-0`} 
            />
            {sidebarOpen && (
              <span className="truncate animate-fadeIn">{item.label}</span>
            )}
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-600 rounded-r-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-error-600 hover:bg-error-50 hover:text-error-700 rounded-lg transition-all duration-200 group text-sm font-medium"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={18} className="text-error-500 group-hover:text-error-600 transition-colors flex-shrink-0" />
          {sidebarOpen && <span className="animate-fadeIn">Logout</span>}
        </button>
      </div>
    </aside>
  );
};