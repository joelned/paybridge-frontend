// src/hooks/usePageTitle.ts
import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - PayBridge`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};