import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Breakpoint constants
export const BREAKPOINTS = {
  xs: '320px',
  sm: '375px', 
  md: '768px',
  lg: '1024px',
  xl: '1440px',
  '2xl': '1920px',
} as const;

// Responsive hooks
export const useIsMobile = () => useMediaQuery(`(max-width: ${BREAKPOINTS.md})`);
export const useIsTablet = () => useMediaQuery(`(min-width: ${BREAKPOINTS.md}) and (max-width: ${BREAKPOINTS.lg})`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${BREAKPOINTS.lg})`);

export const useBreakpoint = () => {
  const isXs = useMediaQuery(`(max-width: ${BREAKPOINTS.sm})`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}) and (max-width: ${BREAKPOINTS.md})`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}) and (max-width: ${BREAKPOINTS.lg})`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}) and (max-width: ${BREAKPOINTS.xl})`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl})`);

  if (isXs) return 'xs';
  if (isSm) return 'sm';
  if (isMd) return 'md';
  if (isLg) return 'lg';
  if (isXl) return 'xl';
  return 'md'; // fallback
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};