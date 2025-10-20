// src/components/layout/PageLayout.tsx
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {children}
    </div>
  );
};

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageSection: React.FC<PageSectionProps> = ({ children, className = '' }) => {
  return (
    <section className={`${className}`}>
      {children}
    </section>
  );
};