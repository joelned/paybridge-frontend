// src/components/layout/Toolbar.tsx
import React from 'react';

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center ${className}`}>
      {children}
    </div>
  );
};


