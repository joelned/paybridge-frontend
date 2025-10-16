import React from 'react';
import type { StatCardProps } from '../../types';
import { Card } from './Card';

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend = 'up', subtitle }) => (
  <Card hover className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {change && (
          <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-green-100' : 'bg-indigo-100'}`}>
        <Icon className={trend === 'up' ? 'text-green-600' : 'text-indigo-600'} size={24} />
      </div>
    </div>
  </Card>
);