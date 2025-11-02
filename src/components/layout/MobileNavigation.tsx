import React from 'react';
import { useLocation } from 'react-router-dom';

interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

interface MobileNavigationProps {
  items: MobileNavItem[];
  onNavigate: (path: string) => void;
}

export const MobileNavigation = React.memo(({ items, onNavigate }: MobileNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-40 md:hidden">
      <div className="flex justify-around items-center px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium mt-1 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

MobileNavigation.displayName = 'MobileNavigation';