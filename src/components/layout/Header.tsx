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
    <header className="bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 lg:px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 min-w-0 pr-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight truncate mb-1">
            {title}
          </h1>
          <p className="text-sm text-gray-600 truncate">
            Welcome back, <span className="font-medium text-gray-900">{userEmail.split('@')[0]}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            className="relative px-3 py-2 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 rounded-lg"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-gray-500" />
            <span className="hidden sm:inline ml-2 text-gray-700 font-medium text-sm">Notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white"></span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            aria-label="Account menu"
          >
            <User size={18} className="text-gray-500" />
          </Button>
        </div>
      </div>
    </header>
  );
};