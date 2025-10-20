// src/components/layout/Header.tsx
import React from 'react';
import { Button } from '../common/Button';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  menuItems: Array<{ id: string; label: string }>;
  userEmail: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, menuItems, userEmail }) => {
  const title = menuItems.find(item => item.id === activeTab)?.label;
  return (
    <header className="bg-white/98 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 border-b border-slate-200/60 sticky top-0 z-40 shadow-sm shadow-slate-900/5">
      <div className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 min-w-0 pr-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight truncate mb-1">
            {title}
          </h1>
          <p className="text-sm text-slate-600 truncate">
            Welcome back, <span className="font-semibold text-slate-800">{userEmail.split('@')[0]}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="relative px-3.5 py-2.5 hover:bg-slate-50/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-xl border border-transparent hover:border-slate-200/50"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-500" />
            <span className="hidden sm:inline ml-2 text-slate-700 font-medium text-sm">Notifications</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white shadow-sm"></span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2.5 hover:bg-slate-50/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 border border-transparent hover:border-slate-200/50"
            aria-label="Account menu"
          >
            <User size={18} className="text-slate-500" />
          </Button>
        </div>
      </div>
    </header>
  );
};