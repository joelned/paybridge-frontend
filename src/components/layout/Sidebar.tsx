// src/components/layout/Sidebar.tsx
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
    <aside className={`${sidebarOpen ? 'w-64' : 'w-18'} bg-white/95 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300 ease-in-out flex flex-col h-full shadow-xl shadow-slate-900/5`}>
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between min-h-[88px]">
        {sidebarOpen && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <GitMerge className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">PayBridge</span>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2.5 hover:bg-slate-100/80 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none group"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={18} className="text-slate-500 group-hover:text-slate-700" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative text-sm font-medium ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50'
                : 'text-slate-700 hover:bg-slate-50/80 hover:text-slate-900'
            }`}
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon 
              size={18} 
              className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'} transition-colors flex-shrink-0`} 
            />
            {sidebarOpen && (
              <span className="truncate animate-fadeIn">{item.label}</span>
            )}
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-xl transition-all duration-200 group text-sm font-medium border border-transparent hover:border-red-100/50"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={18} className="text-red-500 group-hover:text-red-600 transition-colors flex-shrink-0" />
          {sidebarOpen && <span className="animate-fadeIn">Logout</span>}
        </button>
      </div>
    </aside>
  );
};