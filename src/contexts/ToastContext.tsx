// src/contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', title?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info', title?: string) => {
    addToast({ 
      type, 
      title: title || type.charAt(0).toUpperCase() + type.slice(1), 
      message 
    });
  }, [addToast]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
    }
  };

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-3 inset-x-3 sm:top-4 sm:right-4 sm:left-auto z-[1080] space-y-2 sm:max-w-sm pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
        role="region"
      >
        {toasts.map((toast, index) => {
          const Icon = getIcon(toast.type);
          return (
            <div
              key={toast.id}
              className={`w-full max-w-full p-3 sm:p-4 rounded-xl border shadow-lg animate-slide-in-right pointer-events-auto ${getColors(toast.type)}`}
              style={{ zIndex: 50 - index }} // Ensure proper stacking
              role="alert"
              aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Icon size={18} className="flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm break-words">{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs sm:text-sm mt-1 opacity-90 break-words leading-relaxed">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1.5 min-h-[32px] min-w-[32px] hover:bg-black/10 rounded-lg transition-colors"
                  aria-label={`Dismiss ${toast.title} notification`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
