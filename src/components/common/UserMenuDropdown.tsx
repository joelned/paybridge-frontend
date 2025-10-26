// src/components/common/UserMenuDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, CreditCard, Shield } from 'lucide-react';
import { Card } from './Card';
import type { User as UserType } from '../../types/auth';

interface UserMenuDropdownProps {
  user: UserType;
  onLogout: () => void;
}

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { icon: User, label: 'Profile', action: () => console.log('Profile clicked') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings clicked') },
    { icon: CreditCard, label: 'Billing', action: () => console.log('Billing clicked') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help clicked') },
  ];

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 hover:bg-slate-50/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 border border-transparent hover:border-slate-200/50"
        aria-label="Account menu"
      >
        <User size={18} className="text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 animate-scaleUp origin-top-right z-50">
          <Card className="shadow-2xl border-slate-200 overflow-hidden">
            {/* User Info Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-100/50">
                  <span className="text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{user.username}</h3>
                  <p className="text-sm text-slate-600 truncate">{user.email}</p>
                  {user.userType && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      <Shield size={12} />
                      {user.userType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuItemClick(item.action)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                >
                  <item.icon size={18} className="text-slate-500 group-hover:text-slate-700" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-200 py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
              >
                <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};