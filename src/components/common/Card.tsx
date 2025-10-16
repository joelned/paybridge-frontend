// src/components/common/Card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  hover = false, 
  className = '',
  ...props 
}) => {
  return (
    <div
      {...props}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};