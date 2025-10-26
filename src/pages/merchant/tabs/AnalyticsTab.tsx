import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/section/SectionHeader';
import { Badge } from '../../../components/common/Badge';
import { ExportDataModal } from '../../../components/modals/ExportDataModal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, AlertTriangle, Download, RefreshCw, Calendar, Filter, Zap, Shield } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon: Icon, subtitle }) => (
  <Card padding="lg" className="border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={18} className="text-gray-600" />
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp size={14} className="text-emerald-600" />
          ) : (
            <TrendingDown size={14} className="text-red-600" />
          )}
          <span className={`text-xs font-semibold ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      </div>
    </div>
  </Card>
);

export const AnalyticsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const kpiData = [
    { title: 'Total Volume', value: '$2.4M', change: '+12.5%', trend: 'up' as const, icon: DollarSign, subtitle: 'Across all providers' },
    { title: 'Success Rate', value: '98.7%', change: '+0.3%', trend: 'up' as const, icon: TrendingUp, subtitle: 'Combined success rate' },
    { title: 'Active Providers', value: '5', change: '+1', trend: 'up' as const, icon: CreditCard, subtitle: 'Connected providers' },
    { title: 'Avg Latency', value: '247ms', change: '-15ms', trend: 'up' as const, icon: AlertTriangle, subtitle: 'Cross-provider avg' },
    { title: 'Failed Transactions', value: '142', change: '-23', trend: 'up' as const, icon: AlertTriangle, subtitle: 'All providers combined' },
    { title: 'Provider Uptime', value: '99.8%', change: '+0.1%', trend: 'up' as const, icon: TrendingUp, subtitle: 'Average uptime' }
  ];

  const chartData = [
    { date: '2024-01-01', revenue: 45000, users: 289, retention: 85.2, engagement: 72.1, newUsers: 45, returningUsers: 244 },
    { date: '2024-01-02', revenue: 52000, users: 324, retention: 86.1, engagement: 74.3, newUsers: 52, returningUsers: 272 },
    { date: '2024-01-03', revenue: 48000, users: 298, retention: 84.8, engagement: 71.8, newUsers: 38, returningUsers: 260 },
    { date: '2024-01-04', revenue: 61000, users: 387, retention: 87.3, engagement: 76.2, newUsers: 67, returningUsers: 320 },
    { date: '2024-01-05', revenue: 55000, users: 342, retention: 85.9, engagement: 73.5, newUsers: 48, returningUsers: 294 },
    { date: '2024-01-06', revenue: 58000, users: 361, retention: 86.7, engagement: 75.1, newUsers: 55, returningUsers: 306 },
    { date: '2024-01-07', revenue: 63000, users: 398, retention: 88.1, engagement: 77.4, newUsers: 71, returningUsers: 327 }
  ];

  const cohortData = [
    { week: 'Week 1', retention: 100, users: 1000 },
    { week: 'Week 2', retention: 65.2, users: 652 },
    { week: 'Week 3', retention: 48.7, users: 487 },
    { week: 'Week 4', retention: 38.9, users: 389 },
    { week: 'Week 8', retention: 28.4, users: 284 },
    { week: 'Week 12', retention: 22.1, users: 221 }
  ];

  const segmentData = [
    { segment: 'Enterprise', revenue: 890000, users: 127, avgValue: 7008, growth: 23.4 },
    { segment: 'SMB', revenue: 1200000, users: 2847, avgValue: 421, growth: 18.7 },
    { segment: 'Startup', revenue: 310000, users: 8924, avgValue: 35, growth: 45.2 }
  ];

  const providerData = [
    { name: 'Stripe', volume: 1200000, successRate: 98.9, avgLatency: 245, transactions: 4821, uptime: 99.9, color: '#6366f1' },
    { name: 'Flutterwave', volume: 350000, successRate: 98.4, avgLatency: 189, transactions: 1892, uptime: 99.8, color: '#f59e0b' },
    { name: 'Razorpay', volume: 280000, successRate: 98.1, avgLatency: 267, transactions: 1456, uptime: 99.6, color: '#8b5cf6' },
    { name: 'Square', volume: 180000, successRate: 97.5, avgLatency: 298, transactions: 987, uptime: 99.5, color: '#06b6d4' }
  ];

  const providerTrends = [
    { date: '2024-01-01', stripe: 45000, paypal: 32000, flutterwave: 18000, razorpay: 12000, square: 8000 },
    { date: '2024-01-02', stripe: 52000, paypal: 35000, flutterwave: 19500, razorpay: 13200, square: 8500 },
    { date: '2024-01-03', stripe: 48000, paypal: 33000, flutterwave: 17800, razorpay: 11800, square: 7900 },
    { date: '2024-01-04', stripe: 61000, paypal: 38000, flutterwave: 21000, razorpay: 14500, square: 9200 },
    { date: '2024-01-05', stripe: 55000, paypal: 36000, flutterwave: 19200, razorpay: 13800, square: 8800 },
    { date: '2024-01-06', stripe: 58000, paypal: 37500, flutterwave: 20100, razorpay: 14200, square: 9000 },
    { date: '2024-01-07', stripe: 63000, paypal: 39000, flutterwave: 21500, razorpay: 15000, square: 9500 }
  ];

  const providerAlerts = [
    { provider: 'Razorpay', type: 'info', message: 'Scheduled maintenance window', time: '1 day ago' },
    { provider: 'Stripe', type: 'success', message: 'Performance optimization completed', time: '3 days ago' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = async (config: any) => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExporting(false);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics & Insights"
        subtitle="Comprehensive payment performance and business intelligence"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleRefresh} loading={refreshing}>
              Refresh
            </Button>
            <Button variant="outline" size="sm" icon={Download} onClick={() => setShowExportModal(true)}>
              Export
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Alerts */}
      <Card padding="lg" className="border-l-4 border-l-amber-500 bg-amber-50/50">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900">Settlement Delay Alert</h4>
            <p className="text-sm text-amber-800 mt-1">
              3 transactions totaling $12,450 are pending settlement for over 24 hours. 
              <button className="underline font-medium ml-1">View details</button>
            </p>
          </div>
        </div>
      </Card>

      {/* Revenue & User Growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
            <Badge variant="success">+12.5% MoM</Badge>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Acquisition</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Bar dataKey="newUsers" stackId="a" fill="#6366f1" name="New Users" />
              <Bar dataKey="returningUsers" stackId="a" fill="#8b5cf6" name="Returning Users" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Customer Segments Performance */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Segment</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Users</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth</th>
              </tr>
            </thead>
            <tbody>
              {segmentData.map((segment, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{segment.segment}</span>
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${(segment.revenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-4 px-4 text-gray-700">
                    {segment.users.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4 text-gray-700">
                    ${segment.avgValue.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="text-emerald-600 font-semibold">+{segment.growth}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provider Performance Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Provider Volume Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={providerTrends}>
              <defs>
                <linearGradient id="stripeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area type="monotone" dataKey="stripe" stackId="1" stroke="#6366f1" fill="url(#stripeGrad)" />
              <Area type="monotone" dataKey="paypal" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="flutterwave" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Provider Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="volume"
              >
                {providerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Volume']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {providerData.map((provider, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }}></div>
                <span className="text-xs text-gray-700">{provider.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Provider Performance Table */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Multi-Provider Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Volume</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Transactions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Success Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Latency</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {providerData.map((provider, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }}></div>
                      <span className="font-medium text-gray-900">{provider.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 font-semibold text-gray-900">
                    ${(provider.volume / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-4 px-4 text-gray-700">
                    {provider.transactions.toLocaleString()}
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className={`font-semibold ${
                      provider.successRate >= 98.5 ? 'text-emerald-600' : 
                      provider.successRate >= 97 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {provider.successRate}%
                    </span>
                  </td>
                  <td className="text-right py-4 px-4 text-gray-700">{provider.avgLatency}ms</td>
                  <td className="text-right py-4 px-4">
                    <span className={`font-semibold ${
                      provider.uptime >= 99.8 ? 'text-emerald-600' : 
                      provider.uptime >= 99.5 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {provider.uptime}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provider Alerts & Status */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Provider Alerts & Status</h3>
        <div className="space-y-3">
          {providerAlerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'border-amber-500 bg-amber-50' :
              alert.type === 'info' ? 'border-blue-500 bg-blue-50' :
              'border-emerald-500 bg-emerald-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{alert.provider}</span>
                    <Badge variant={alert.type === 'warning' ? 'warning' : alert.type === 'info' ? 'info' : 'success'}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        loading={exporting}
      />
    </div>
  );
};