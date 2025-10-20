// src/components/layout/Container.tsx
import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={`max-w-7xl mx-auto px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
};


