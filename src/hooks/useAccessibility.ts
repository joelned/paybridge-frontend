import { useEffect, useRef } from 'react';

export const useAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);

  const focusFirst = () => {
    if (focusRef.current) {
      const firstFocusable = focusRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  };

  const focusElement = (selector: string) => {
    if (focusRef.current) {
      const element = focusRef.current.querySelector(selector) as HTMLElement;
      element?.focus();
    }
  };

  return { focusRef, focusFirst, focusElement };
};

export const useKeyboardNavigation = (onEscape?: () => void, onEnter?: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Enter':
          // Only trigger custom Enter handlers for elements that explicitly opt in.
          // This prevents globally hijacking native Enter behavior.
          if (onEnter && target?.dataset.keyboardEnter === 'true') {
            event.preventDefault();
            onEnter();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};
