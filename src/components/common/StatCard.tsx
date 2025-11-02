import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Props {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<any>;
  loading?: boolean;
  className?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return <LoadingSkeleton variant="stat" className={className} />;
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600'
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {change && (
          <p className={`text-sm font-medium ${trendColors[trend]}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};