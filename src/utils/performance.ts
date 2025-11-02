// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  private static measures = new Map<string, number>();

  static mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }

  static measure(name: string, startMark: string, endMark?: string): number {
    if (typeof performance === 'undefined') return 0;
    
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      const duration = measure?.duration || 0;
      this.measures.set(name, duration);
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return 0;
    }
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  static clear(): void {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
    this.marks.clear();
    this.measures.clear();
  }
}

// React component performance tracker
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const renderStart = `${componentName}-render-start`;
    const renderEnd = `${componentName}-render-end`;
    
    React.useLayoutEffect(() => {
      PerformanceMonitor.mark(renderStart);
      return () => {
        PerformanceMonitor.mark(renderEnd);
        PerformanceMonitor.measure(`${componentName}-render`, renderStart, renderEnd);
      };
    });

    return React.createElement(Component, props);
  });
};

// Hook for tracking expensive computations
export const usePerformanceTracker = (operationName: string) => {
  return React.useCallback((fn: () => any) => {
    const startMark = `${operationName}-start`;
    const endMark = `${operationName}-end`;
    
    PerformanceMonitor.mark(startMark);
    const result = fn();
    PerformanceMonitor.mark(endMark);
    PerformanceMonitor.measure(operationName, startMark, endMark);
    
    return result;
  }, [operationName]);
};