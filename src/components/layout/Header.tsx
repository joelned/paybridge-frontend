import React from 'react';
import { Button } from '../common/Button';
import { Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  menuItems: Array<{ id: string; label: string }>;
  userEmail: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, menuItems, userEmail }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {userEmail}</p>
        </div>
        <Button variant="primary" icon={Bell}>Notifications</Button>
      </div>
    </header>
  );
};