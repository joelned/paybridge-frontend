import React, { createContext, useContext, useMemo, ReactNode } from 'react';

interface PerformanceContextValue {
  enableProfiling: boolean;
  trackRenders: boolean;
  logSlowOperations: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue>({
  enableProfiling: false,
  trackRenders: false,
  logSlowOperations: false,
});

interface PerformanceProviderProps {
  children: ReactNode;
  enableProfiling?: boolean;
  trackRenders?: boolean;
  logSlowOperations?: boolean;
}

export const PerformanceProvider = React.memo(({
  children,
  enableProfiling = import.meta.env.DEV,
  trackRenders = import.meta.env.DEV,
  logSlowOperations = import.meta.env.DEV
}: PerformanceProviderProps) => {
  const value = useMemo(() => ({
    enableProfiling,
    trackRenders,
    logSlowOperations,
  }), [enableProfiling, trackRenders, logSlowOperations]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
});

PerformanceProvider.displayName = 'PerformanceProvider';

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};