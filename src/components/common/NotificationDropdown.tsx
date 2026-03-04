// src/components/common/NotificationDropdown.tsx
import React, { useRef, useEffect } from 'react';
import { Check, Trash2, Settings, X } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-emerald-600';
      case 'warning': return 'text-amber-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-3 w-96 animate-scaleUp origin-top-right z-50" ref={dropdownRef}>
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
                  onClick={onMarkAllAsRead}
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
                  className={`px-5 py-4 hover:bg-slate-50/80 transition-colors group ${!notif.read ? 'bg-blue-50/30' : ''
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
                            onClick={() => onMarkAsRead(notif.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(notif.id)}
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
  );
};
