import { useEffect, useRef } from 'react';

interface RenderInfo {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  props?: any;
}

const renderStats = new Map<string, RenderInfo>();

export const useRenderTracker = (componentName: string, props?: any) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    const info: RenderInfo = {
      componentName,
      renderCount: renderCount.current,
      lastRenderTime: now,
      props: process.env.NODE_ENV === 'development' ? props : undefined,
    };

    renderStats.set(componentName, info);

    // Log frequent re-renders in development
    if (process.env.NODE_ENV === 'development') {
      if (renderCount.current > 1 && timeSinceLastRender < 100) {
        console.warn(
          `🔄 Frequent re-render detected: ${componentName} rendered ${renderCount.current} times. ` +
          `Last render was ${timeSinceLastRender}ms ago.`,
          props
        );
      }

      // Log render count milestones
      if (renderCount.current % 10 === 0) {
        console.info(`📊 ${componentName} has rendered ${renderCount.current} times`);
      }
    }
  });

  return {
    renderCount: renderCount.current,
    getRenderStats: () => renderStats.get(componentName),
    getAllRenderStats: () => Object.fromEntries(renderStats),
  };
};

// Hook to track why a component re-rendered
export const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === 'development') {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log(`🔍 ${name} re-rendered because:`, changedProps);
      }
    }

    previousProps.current = props;
  });
};