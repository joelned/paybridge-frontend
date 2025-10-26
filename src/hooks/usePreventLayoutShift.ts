// src/hooks/usePreventLayoutShift.ts
import { useEffect, useRef } from 'react';

export const usePreventLayoutShift = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Store initial dimensions
    const { width, height } = element.getBoundingClientRect();
    
    // Set minimum dimensions to prevent collapse
    element.style.minWidth = `${width}px`;
    element.style.minHeight = `${height}px`;

    return () => {
      element.style.minWidth = '';
      element.style.minHeight = '';
    };
  }, []);

  return ref;
};