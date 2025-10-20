// src/components/section/SectionHeader.tsx
import React from 'react';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actions, className = '', ...props }) => {
  return (
    <div {...props} className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 ${className}`}>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0 mt-1">{actions}</div>
      )}
    </div>
  );
};


