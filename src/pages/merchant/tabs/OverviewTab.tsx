import React from 'react';
import { DollarSign, Activity, TrendingUp, GitMerge } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OverviewTab: React.FC = () => {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$124,563', 
      change: '+12.5%', 
      icon: DollarSign, 
      trend: 'up' as const,
      subtitle: 'Across all providers'
    },
    { 
      title: 'Transactions', 
      value: '1,284', 
      change: '+8.2%', 
      icon: Activity, 
      trend: 'up' as const,
      subtitle: 'Last 30 days'
    },
    { 
      title: 'Success Rate', 
      value: '98.4%', 
      change: '+2.1%', 
      icon: TrendingUp, 
      trend: 'up' as const,
      subtitle: 'With smart routing'
    },
    { 
      title: 'Providers Active', 
      value: '3/5', 
      icon: GitMerge,
      subtitle: 'Stripe, PayPal, Flutterwave'
    }
  ];

  const recentTransactions = [
    { id: 'pay_1234', customer: 'john@example.com', amount: '$249.00', status: 'SUCCEEDED', provider: 'Stripe', date: '2 min ago' },
    { id: 'pay_1235', customer: 'jane@example.com', amount: '$89.99', status: 'SUCCEEDED', provider: 'PayPal', date: '15 min ago' },
    { id: 'pay_1236', customer: 'bob@example.com', amount: '$1,299.00', status: 'PROCESSING', provider: 'Flutterwave', date: '1 hour ago' },
    { id: 'pay_1237', customer: 'alice@example.com', amount: '$449.50', status: 'SUCCEEDED', provider: 'Stripe', date: '2 hours ago' }
  ];

  const chartData = [
    { name: 'Mon', stripe: 4000, paypal: 2400, flutterwave: 1200 },
    { name: 'Tue', stripe: 3000, paypal: 1398, flutterwave: 2210 },
    { name: 'Wed', stripe: 5000, paypal: 3800, flutterwave: 2290 },
    { name: 'Thu', stripe: 4500, paypal: 3908, flutterwave: 2000 },
    { name: 'Fri', stripe: 6000, paypal: 4800, flutterwave: 2181 },
    { name: 'Sat', stripe: 5500, paypal: 3800, flutterwave: 2500 },
    { name: 'Sun', stripe: 7000, paypal: 4300, flutterwave: 2100 }
  ];

  const providerStats = [
    { provider: 'Stripe', volume: '$45,234', transactions: 543, successRate: '99.2%', color: '#6366f1' },
    { provider: 'PayPal', volume: '$38,129', transactions: 412, successRate: '97.8%', color: '#10b981' },
    { provider: 'Flutterwave', volume: '$41,200', transactions: 329, successRate: '98.5%', color: '#f59e0b' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Provider Performance Cards */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Provider Performance</h3>
        <p className="text-xs text-gray-500 mb-3 sm:mb-4">Last 7 days</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {providerStats.map((stat, idx) => (
            <Card key={idx} padding="lg" variant="soft" className="">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="font-semibold text-gray-900">{stat.provider}</h4>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Volume</span>
                  <span className="font-semibold text-gray-900">{stat.volume}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Transactions</span>
                  <span className="font-semibold text-gray-900">{stat.transactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-semibold text-green-600">{stat.successRate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card padding="lg" className="">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Revenue by Provider</h3>
          <div className="h-56 sm:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="stripe" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paypal" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flutterwave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg" className="">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-indigo-600 hover:underline text-xs sm:text-sm font-medium" aria-label="View all recent transactions">View all</button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-100 dark:border-gray-800">
            {recentTransactions.map((txn, idx) => (
              <div key={txn.id} className={`flex items-center justify-between p-3 ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === recentTransactions.length - 1 ? 'rounded-b-lg' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{txn.customer}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{txn.provider} • {txn.date}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-semibold text-gray-900 text-sm">{txn.amount}</p>
                  <Badge variant={txn.status === 'SUCCEEDED' ? 'success' : 'warning'}>
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};