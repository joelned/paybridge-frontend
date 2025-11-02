import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<Props> = ({ 
  isVisible, 
  text = 'Loading...', 
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl ${className}`}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-slate-700">{text}</p>
      </div>
    </div>
  );
};