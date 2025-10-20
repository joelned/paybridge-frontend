// src/components/layout/Toolbar.tsx
import React from 'react';

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={`grid gap-3 md:grid-cols-[1fr_auto_auto] items-center ${className}`}>
      {children}
    </div>
  );
};


