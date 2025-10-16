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
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Provider Performance Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {providerStats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{stat.provider}</h4>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volume</span>
                  <span className="font-semibold text-gray-900">{stat.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transactions</span>
                  <span className="font-semibold text-gray-900">{stat.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">{stat.successRate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Provider</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="stripe" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paypal" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flutterwave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{txn.customer}</p>
                  <p className="text-xs text-gray-600">{txn.provider} • {txn.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{txn.amount}</p>
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