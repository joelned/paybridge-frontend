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
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-semibold sm:font-bold text-gray-900 tracking-tight truncate">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
            Welcome back, {userEmail}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 ml-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 sm:px-3 hover:bg-gray-100/80"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="hidden sm:inline ml-2">Notifications</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 hover:bg-gray-100/80 rounded-full"
            aria-label="Account"
          >
            <User size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};