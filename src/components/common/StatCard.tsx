import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber, formatPercentage } from '../../utils/formatters';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<any>;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  loading?: boolean;
}

const COLOR_STYLES = {
  primary: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accent: 'bg-blue-500'
  },
  success: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    accent: 'bg-green-500'
  },
  warning: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    accent: 'bg-yellow-500'
  },
  danger: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    accent: 'bg-red-500'
  },
  info: {
    bg: 'bg-gray-50',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    accent: 'bg-gray-500'
  }
};

const TREND_STYLES = {
  up: { icon: TrendingUp, color: 'text-green-600' },
  down: { icon: TrendingDown, color: 'text-red-600' },
  neutral: { icon: Minus, color: 'text-gray-600' }
};

export const StatCard = React.memo(({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'primary',
  className = '',
  loading = false
}: StatCardProps) => {
  const colorStyle = COLOR_STYLES[color];
  const trendStyle = TREND_STYLES[trend];
  const TrendIcon = trendStyle.icon;

  const formattedValue = typeof value === 'number' 
    ? formatNumber(value, { compact: true })
    : value;

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-20 h-8 bg-gray-200 rounded" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorStyle.accent}`} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg ${colorStyle.iconBg}`}>
            <Icon className={`w-5 h-5 ${colorStyle.iconColor}`} />
          </div>
        )}
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendStyle.color}`}>
            <TrendIcon size={14} />
            <span>{formatPercentage(Math.abs(change))}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>

      {/* Hover effect */}
      <div className={`absolute inset-0 ${colorStyle.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
    </div>
  );
});

StatCard.displayName = 'StatCard';