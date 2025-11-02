import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, DollarSign, CreditCard, Target, Zap, Filter, RefreshCw, ArrowUpRight, ArrowDownRight, Activity, PieChart, LineChart, Users, Clock, Globe } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { useModalContext } from '../../../contexts/ModalContext';

export const AnalyticsTab: React.FC = () => {
  const { openModal } = useModalContext();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeChart, setActiveChart] = useState('revenue');

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,563',
      change: '+12.5%',
      trend: 'up' as const,
      period: 'vs last period',
      icon: DollarSign,
      color: 'emerald',
      previousValue: '$110,945',
      target: '$130,000'
    },
    {
      title: 'Transaction Volume',
      value: '1,284',
      change: '+8.2%',
      trend: 'up' as const,
      period: 'transactions',
      icon: CreditCard,
      color: 'blue',
      previousValue: '1,186',
      target: '1,400'
    },
    {
      title: 'Average Order Value',
      value: '$97.12',
      change: '+4.1%',
      trend: 'up' as const,
      period: 'per transaction',
      icon: Target,
      color: 'indigo',
      previousValue: '$93.28',
      target: '$100.00'
    },
    {
      title: 'Success Rate',
      value: '98.4%',
      change: '+2.1%',
      trend: 'up' as const,
      period: 'completion rate',
      icon: Zap,
      color: 'amber',
      previousValue: '96.3%',
      target: '99.0%'
    }
  ];

  const providerBreakdown = [
    { 
      provider: 'Stripe', 
      percentage: 45, 
      amount: '$55,953', 
      transactions: 578,
      avgValue: '$96.80',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+5.2%'
    },
    { 
      provider: 'PayPal', 
      percentage: 35, 
      amount: '$43,597', 
      transactions: 449,
      avgValue: '$97.10',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+3.8%'
    },
    { 
      provider: 'Flutterwave', 
      percentage: 20, 
      amount: '$25,013', 
      transactions: 257,
      avgValue: '$97.32',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      change: '+12.1%'
    }
  ];

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const chartTypes = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'volume', label: 'Volume', icon: BarChart3 },
    { id: 'conversion', label: 'Conversion', icon: Target }
  ];

  const getMetricIcon = (color: string, IconComponent: React.ComponentType<any>) => {
    const colorClasses = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      amber: 'bg-amber-100 text-amber-600'
    };
    return colorClasses[color as keyof typeof colorClasses] || 'bg-slate-100 text-slate-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? ArrowUpRight : ArrowDownRight;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Minimal header with key actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">Performance insights and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" icon={Download} onClick={() => openModal('exportData', { type: 'analytics' })}>
            Export
          </Button>
        </div>
      </div>
      {/* KPI Cards - Clear at-a-glance metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          const isPositive = metric.trend === 'up';
          return (
            <Card key={index} className="p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  metric.color === 'emerald' ? 'bg-emerald-50' :
                  metric.color === 'blue' ? 'bg-blue-50' :
                  metric.color === 'indigo' ? 'bg-indigo-50' : 'bg-amber-50'
                }`}>
                  <IconComponent size={18} className={`${
                    metric.color === 'emerald' ? 'text-emerald-600' :
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600'
                  }`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  <TrendIcon size={12} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                <p className="text-xs text-slate-500">{metric.period}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Primary focus */}
        <Card className="lg:col-span-2">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-sm text-slate-600 mt-1">Track performance over time</p>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {chartTypes.map((chart) => {
                  const IconComponent = chart.icon;
                  return (
                    <button
                      key={chart.id}
                      onClick={() => setActiveChart(chart.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        activeChart === chart.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <IconComponent size={14} />
                      <span className="hidden sm:inline">{chart.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-72 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-100 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto">
                  <LineChart size={24} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-700">Interactive Chart</p>
                  <p className="text-sm text-slate-500">Real-time revenue visualization</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Provider Performance - Secondary focus */}
        <Card>
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Top Providers</h3>
            <p className="text-sm text-slate-600 mt-1">Revenue by provider</p>
          </div>
          <div className="p-5 space-y-5">
            {providerBreakdown.map((provider, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      provider.bgColor
                    }`}>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${provider.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{provider.provider}</p>
                      <p className="text-xs text-slate-500">{provider.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{provider.amount}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <ArrowUpRight size={12} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-600">{provider.change}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{provider.percentage}% of total</span>
                    <span>{provider.avgValue} avg</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r ${provider.color} transition-all duration-700`}
                      style={{ width: `${provider.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transaction Activity - Minimal but informative */}
      <Card>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Transaction Activity</h3>
              <p className="text-sm text-slate-600 mt-1">Volume patterns and trends</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {['24H', '7D', '30D'].map((period) => (
                <button 
                  key={period}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-100 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto">
                <Activity size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Activity Timeline</p>
                <p className="text-sm text-slate-500">Transaction volume over time</p>
              </div>
              {/* Status indicators */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-slate-600">Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-xs text-slate-600">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs text-slate-600">Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsTab;