// src/components/common/BreadcrumbNavigation.tsx
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ 
  items, 
  className = '' 
}) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Home size={16} className="text-slate-400" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-slate-400" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={`${
                index === items.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              } transition-colors`}
            >
              {item.label}
            </button>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-600'
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};