// src/components/ui/PreloadedContent.tsx
import { memo, useEffect, useState } from 'react';
import { Skeleton } from './Skeleton';

interface PreloadedContentProps {
  children: React.ReactNode;
  loading?: boolean;
  skeleton?: React.ReactNode;
  minHeight?: string;
}

export const PreloadedContent = memo<PreloadedContentProps>(({
  children,
  loading = false,
  skeleton,
  minHeight = 'auto'
}) => {
  const [isVisible, setIsVisible] = useState(!loading);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [loading]);

  return (
    <div style={{ minHeight }} className="relative">
      {loading && (
        <div className="absolute inset-0 z-10">
          {skeleton || <Skeleton height="100%" />}
        </div>
      )}
      <div 
        className={`transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        {children}
      </div>
    </div>
  );
});