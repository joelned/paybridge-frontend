// src/components/common/NotificationDropdown.tsx - MOBILE RESPONSIVE VERSION
import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Settings, X } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  time: string;
  read: boolean;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      title: 'Reconciliation Complete',
      message: 'Monthly reconciliation finished with 2 discrepancies',
      type: 'warning',
      time: '2 hours ago',
      read: true
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll on mobile when dropdown is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-600';
      case 'warning': return 'text-amber-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative px-2 sm:px-3.5 py-2 sm:py-2.5 hover:bg-slate-50/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-xl border border-transparent hover:border-slate-200/50 flex items-center gap-1.5 sm:gap-2"
        aria-label="Notifications"
      >
        <span className="hidden lg:inline text-slate-700 font-medium text-sm">Notifications</span>
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white shadow-sm sm:block"></span>
            <Badge variant="danger" size="sm" className="ml-1 hidden md:inline-flex">
              {unreadCount}
            </Badge>
          </>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown/Modal */}
      {isOpen && (
        <>
          {/* Desktop Dropdown */}
          <div className="hidden md:block absolute right-0 mt-3 w-96 animate-scaleUp origin-top-right z-50">
            <Card className="shadow-2xl border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">Notifications</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Settings"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-600 font-medium">No notifications</p>
                    <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-5 py-4 hover:bg-slate-50/80 transition-colors group ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${getNotificationColor(notif.type)}`}>
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notif.title}
                              </h4>
                              <span className="text-xs text-slate-500 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Check size={14} />
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-1 hover:bg-blue-50 rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* Mobile Bottom Sheet */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 animate-slideInUp">
            <Card className="rounded-t-3xl rounded-b-none shadow-2xl border-slate-200 border-b-0 max-h-[85vh] flex flex-col">
              {/* Mobile Header */}
              <div className="px-4 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-t-3xl flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">Notifications</h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Mobile Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-600 font-medium">No notifications</p>
                    <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-4 hover:bg-slate-50/80 transition-colors group ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${getNotificationColor(notif.type)}`}>
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-sm font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notif.title}
                              </h4>
                              <span className="text-xs text-slate-500 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{notif.message}</p>
                            <div className="flex items-center gap-2">
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Check size={12} />
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex-shrink-0">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-2 hover:bg-blue-50 rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
