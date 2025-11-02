// src/components/layout/Header.tsx - Refactored for consistent design system
import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, X, ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  activeTab: string;
  menuItems: Array<{ id: string; label: string }>;
  userEmail: string;
  userData?: { businessName?: string };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  menuItems, 
  userEmail, 
  userData, 
  onLogout 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const currentPage = menuItems.find(item => item.id === activeTab);
  const displayName = userData?.businessName || userEmail.split('@')[0];
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('modal-open');
    };
  }, [showNotifications, showUserMenu]);

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 truncate">
                {currentPage?.label || 'Dashboard'}
              </h1>
              <div className="hidden sm:block w-px h-4 bg-slate-300" />
              <p className="hidden sm:block text-sm text-slate-600 truncate">
                Welcome back, <span className="font-semibold">{displayName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <X size={16} className="text-slate-500" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell size={20} className="text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-700 mb-1">No new notifications</p>
                      <p className="text-sm text-slate-500">You're all caught up!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none group"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
                <ChevronDown 
                  size={14} 
                  className={`text-slate-500 group-hover:text-slate-700 transition-all duration-200 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                        <p className="text-sm text-slate-500 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={16} className="text-slate-500" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings size={16} className="text-slate-500" />
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <HelpCircle size={16} className="text-slate-500" />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-2">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};