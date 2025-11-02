import React, { useMemo } from 'react';
import { useIsMobile, useScreenSize } from '../../hooks/useMediaQuery';

interface ResponsiveChartProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ResponsiveChart = React.memo(({
  children,
  title,
  className = '',
}: ResponsiveChartProps) => {
  const isMobile = useIsMobile();
  const { width } = useScreenSize();

  const chartHeight = useMemo(() => {
    if (isMobile) return 300;
    if (width < 1024) return 350;
    return 400;
  }, [isMobile, width]);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div 
        className="chart-responsive"
        style={{ height: chartHeight }}
      >
        {children}
      </div>
    </div>
  );
});

ResponsiveChart.displayName = 'ResponsiveChart';