// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, X } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  activeTab: string;
  menuItems: Array<{ id: string; label: string }>;
  userEmail: string;
  userData?: { businessName?: string };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, menuItems, userEmail, userData, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const title = menuItems.find(item => item.id === activeTab)?.label;

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
    <>
      <header className="bg-white/98 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 border-b border-slate-200/60 sticky top-0 z-40 shadow-sm shadow-slate-900/5">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1 min-w-0 pr-4 sm:pr-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight truncate mb-1">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 truncate">
              Welcome back, <span className="font-semibold text-slate-800">{userData?.businessName || userEmail.split('@')[0]}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative px-2 sm:px-3.5 py-2.5 hover:bg-slate-50/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-xl border border-transparent hover:border-slate-200/50"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-slate-500" />
                <span className="hidden sm:inline ml-2 text-slate-700 font-medium text-sm">Notifications</span>
              </Button>
              
              {showNotifications && (
                <>
                  <div className="hidden sm:block absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 animate-scaleUp">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 text-center text-slate-500">
                        <p className="font-medium">No notifications</p>
                        <p className="text-xs mt-1">You're all caught up!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:hidden">
                    <div className="mobile-overlay" onClick={() => setShowNotifications(false)} />
                    <div className="notification-dropdown bg-white animate-slideInUp z-50">
                      <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-slate-100 rounded-lg"
                        >
                          <X size={20} className="text-slate-500" />
                        </button>
                      </div>
                      <div className="overflow-y-auto">
                        <div className="p-8 text-center text-slate-500">
                          <p className="font-medium text-base">No notifications</p>
                          <p className="text-sm mt-1">You're all caught up!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2.5 hover:bg-slate-50/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 border border-transparent hover:border-slate-200/50"
                aria-label="Account menu"
              >
                <User size={18} className="text-slate-500" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 animate-scaleUp">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{userData?.businessName || userEmail.split('@')[0]}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      Account Settings
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-2">
                    <button 
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};