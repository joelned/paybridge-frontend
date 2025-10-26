// src/components/common/PageTransition.tsx
import { useEffect, useState, memo } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = memo<PageTransitionProps>(({ children, className = '' }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition ${loaded ? 'loaded' : ''} content-container ${className}`}>
      {children}
    </div>
  );
});