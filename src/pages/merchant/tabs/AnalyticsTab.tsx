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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Premium Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Advanced Analytics
              </h1>
              <p className="text-slate-600 font-medium">Comprehensive insights and performance metrics for data-driven decisions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <Button variant="outline" icon={Filter} className="shadow-sm hover:shadow-md transition-all duration-200">
                Filter
              </Button>
              <Button variant="outline" icon={Download} onClick={() => openModal('exportData', { type: 'analytics' })} className="shadow-sm hover:shadow-md transition-all duration-200">
                Export Report
              </Button>
              <Button 
                variant="primary" 
                icon={RefreshCw} 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Premium Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const TrendIcon = getTrendIcon(metric.trend);
            return (
              <div key={index} className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getMetricIcon(metric.color, IconComponent)}`}>
                      <IconComponent size={24} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getTrendColor(metric.trend)} bg-white shadow-sm`}>
                      <TrendIcon size={14} />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-slate-600 font-semibold text-sm uppercase tracking-wide">{metric.title}</h3>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">{metric.period}</span>
                      <span className="text-slate-400">Target: {metric.target}</span>
                    </div>
                    {/* Progress bar to target */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress to target</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${metric.color === 'emerald' ? 'from-emerald-500 to-emerald-600' : metric.color === 'blue' ? 'from-blue-500 to-blue-600' : metric.color === 'indigo' ? 'from-indigo-500 to-indigo-600' : 'from-amber-500 to-amber-600'} transition-all duration-500`} style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Revenue Analytics</h3>
                    <p className="text-slate-600 text-sm font-medium mt-1">Comprehensive revenue tracking and trends</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {chartTypes.map((chart) => {
                      const IconComponent = chart.icon;
                      return (
                        <button
                          key={chart.id}
                          onClick={() => setActiveChart(chart.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            activeChart === chart.id
                              ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <IconComponent size={16} />
                          <span>{chart.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="h-80 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/40 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-purple-500/5" />
                  <div className="relative text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <LineChart size={32} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-semibold text-lg">Interactive Revenue Chart</p>
                      <p className="text-slate-500 text-sm font-medium">Advanced visualization with real-time data</p>
                      <p className="text-slate-400 text-xs mt-2">Chart.js or D3.js integration would render here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-6 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Provider Performance</h3>
                  <p className="text-slate-600 text-sm font-medium mt-1">Revenue distribution by provider</p>
                </div>
                <Button variant="ghost" size="sm" icon={PieChart} className="text-slate-600 hover:text-slate-900">
                  Details
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {providerBreakdown.map((provider, index) => (
                <div key={index} className="group space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${provider.bgColor} flex items-center justify-center`}>
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${provider.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{provider.provider}</p>
                        <p className="text-xs text-slate-500 font-medium">{provider.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{provider.amount}</p>
                      <div className="flex items-center gap-1">
                        <ArrowUpRight size={12} className="text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-600">{provider.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{provider.percentage}% of total</span>
                      <span>Avg: {provider.avgValue}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${provider.color} transition-all duration-700 ease-out`}
                        style={{ width: `${provider.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Transaction Timeline</h3>
                <p className="text-slate-600 text-sm font-medium mt-1">Real-time transaction patterns and volume analysis</p>
              </div>
              <div className="flex items-center gap-2">
                {['Hourly', 'Daily', 'Weekly'].map((period) => (
                  <Button 
                    key={period}
                    variant="ghost" 
                    size="sm"
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="h-96 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-indigo-500/5" />
              <div className="relative text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Activity size={40} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-700 font-semibold text-xl">Advanced Timeline Visualization</p>
                  <p className="text-slate-500 text-sm font-medium">Interactive timeline showing transaction patterns, peak hours, and trends</p>
                  <p className="text-slate-400 text-xs mt-2">Real-time data streaming with advanced filtering and drill-down capabilities</p>
                </div>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-slate-600 font-medium">Successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span className="text-xs text-slate-600 font-medium">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-xs text-slate-600 font-medium">Failed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Geographic Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <Globe className="text-slate-600" size={20} />
                <h4 className="font-bold text-slate-900">Geographic Distribution</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/40 flex items-center justify-center">
                <div className="text-center">
                  <Globe size={32} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">World map visualization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <Clock className="text-slate-600" size={20} />
                <h4 className="font-bold text-slate-900">Peak Hours Analysis</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/40 flex items-center justify-center">
                <div className="text-center">
                  <Clock size={32} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">Hourly activity heatmap</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <Users className="text-slate-600" size={20} />
                <h4 className="font-bold text-slate-900">Customer Insights</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/40 flex items-center justify-center">
                <div className="text-center">
                  <Users size={32} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">Customer behavior analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;