import React, { useMemo, useCallback } from 'react';
import { useAnalytics } from '../../hooks/queries/useAnalytics';
import { PerformanceMonitor } from '../../utils/performance';

// Lazy load chart library
const Chart = React.lazy(() => 
  import('react-chartjs-2').then(module => ({ default: module.Chart }))
);

interface ChartData {
  labels: string[];
  datasets: any[];
}

const processChartData = (rawData: any[]): ChartData => {
  PerformanceMonitor.mark('chart-data-processing-start');
  
  const processed = {
    labels: rawData.map(item => item.date),
    datasets: [{
      label: 'Revenue',
      data: rawData.map(item => item.amount),
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
    }]
  };
  
  PerformanceMonitor.mark('chart-data-processing-end');
  PerformanceMonitor.measure('chart-data-processing', 'chart-data-processing-start', 'chart-data-processing-end');
  
  return processed;
};

const MemoizedChart = React.memo(({ data }: { data: ChartData }) => (
  <React.Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
    <Chart type="line" data={data} />
  </React.Suspense>
));

MemoizedChart.displayName = 'MemoizedChart';

export const OptimizedAnalyticsTab = React.memo(() => {
  const { data: analyticsData = [], isLoading } = useAnalytics();

  // Memoize expensive chart data transformation
  const chartData = useMemo(() => 
    processChartData(analyticsData), 
    [analyticsData]
  );

  // Memoize summary calculations
  const summary = useMemo(() => {
    if (!analyticsData.length) return { total: 0, average: 0, growth: 0 };
    
    const total = analyticsData.reduce((sum, item) => sum + item.amount, 0);
    const average = total / analyticsData.length;
    const growth = analyticsData.length > 1 
      ? ((analyticsData[analyticsData.length - 1].amount - analyticsData[0].amount) / analyticsData[0].amount) * 100
      : 0;
    
    return { total, average, growth };
  }, [analyticsData]);

  const handleExport = useCallback(() => {
    // Export logic here
    console.log('Exporting analytics data...');
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">${summary.total.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average</h3>
          <p className="text-2xl font-bold text-gray-900">${summary.average.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Growth</h3>
          <p className={`text-2xl font-bold ${summary.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.growth.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export
          </button>
        </div>
        <div className="h-64">
          <MemoizedChart data={chartData} />
        </div>
      </div>
    </div>
  );
});

OptimizedAnalyticsTab.displayName = 'OptimizedAnalyticsTab';