// src/components/layout/Header.tsx - Refactored for consistent design system
import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { CurrencyHeaderSelector } from '../common/CurrencyHeaderSelector';
import { useCurrency } from '../../contexts/CurrencyContext';
import { NotificationDropdown, type Notification } from '../common/NotificationDropdown';

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
  const { selectedCurrency, setCurrency } = useCurrency();

  // Mock notifications state - replace with real data/context later
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Payment Received',
      message: 'New payment of $249.00 from john@example.com',
      type: 'success',
      time: '5 min ago',
      read: false
    },
    {
      id: '2',
      title: 'Provider Connection',
      message: 'Stripe connection verified successfully',
      type: 'success',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Integration Updated',
      message: 'A provider configuration was updated successfully',
      type: 'info',
      time: '2 hours ago',
      read: true
    }
  ]);

  const currentPage = menuItems.find(item => item.id === activeTab);
  const displayName = userData?.businessName || userEmail.split('@')[0];
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

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
            <CurrencyHeaderSelector
              value={selectedCurrency.code}
              onChange={setCurrency}
            />

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
              />
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
                  className={`text-slate-500 group-hover:text-slate-700 transition-all duration-200 ${showUserMenu ? 'rotate-180' : ''
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
