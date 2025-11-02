// src/pages/merchant/tabs/OverviewTab.tsx - Refactored for consistent design system
import { useState, useEffect, useMemo } from 'react';
import { DollarSign, Activity, TrendingUp, GitMerge, ArrowUpRight, ArrowDownRight, Eye, ExternalLink } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

// Enhanced skeleton component with consistent styling
const Skeleton = ({ className = '', width = '100%', height = '1rem' }) => (
  <div 
    className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-pulse rounded-md ${className}`}
    style={{ width, height }}
  />
);

const StatCardSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-3">
        <Skeleton height="0.875rem" width="60%" />
        <Skeleton height="2rem" width="80%" />
        <Skeleton height="0.875rem" width="40%" />
      </div>
      <Skeleton width="48px" height="48px" className="rounded-xl" />
    </div>
  </Card>
);

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: any;
  trend?: 'up' | 'down';
  subtitle?: string;
}

const StatCard = ({ title, value, change, icon: Icon, trend = 'up', subtitle }: StatCardProps) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const bgColor = trend === 'up' ? 'bg-emerald-50' : 'bg-red-50';
  
  return (
    <Card hover className="p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
          <Icon size={20} className="text-slate-600" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor}`}>
            <TrendIcon size={12} className={trendColor} />
            <span className={`text-xs font-bold ${trendColor}`}>{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
        {change && (
          <p className="text-xs text-slate-400">vs last period</p>
        )}
      </div>
    </Card>
  );
};

export const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        stats: [
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
        ],
        providerStats: [
          { provider: 'Stripe', volume: '$45,234', transactions: 543, successRate: '99.2%', color: '#6366f1' },
          { provider: 'PayPal', volume: '$38,129', transactions: 412, successRate: '97.8%', color: '#10b981' },
          { provider: 'Flutterwave', volume: '$41,200', transactions: 329, successRate: '98.5%', color: '#f59e0b' }
        ],
        recentTransactions: [
          { id: 'pay_1234', customer: 'john@example.com', amount: '$249.00', status: 'SUCCEEDED', provider: 'Stripe', date: '2 min ago' },
          { id: 'pay_1235', customer: 'jane@example.com', amount: '$89.99', status: 'SUCCEEDED', provider: 'PayPal', date: '15 min ago' },
          { id: 'pay_1236', customer: 'bob@example.com', amount: '$1,299.00', status: 'PROCESSING', provider: 'Flutterwave', date: '1 hour ago' },
          { id: 'pay_1237', customer: 'alice@example.com', amount: '$449.50', status: 'SUCCEEDED', provider: 'Stripe', date: '2 hours ago' }
        ]
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const statusColors = useMemo(() => ({
    SUCCEEDED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    PROCESSING: 'bg-amber-100 text-amber-800 border border-amber-200',
    FAILED: 'bg-red-100 text-red-800 border border-red-200',
  }), []);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton height="2rem" width="300px" />
          <Skeleton height="1rem" width="500px" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>

        {/* Provider cards skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton height="1.5rem" width="200px" />
            <Skeleton height="1rem" width="300px" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton height="1.5rem" width="100px" />
                    <Skeleton width="12px" height="12px" className="rounded-full" />
                  </div>
                  <Skeleton height="1rem" width="100%" />
                  <Skeleton height="1rem" width="80%" />
                  <Skeleton height="1rem" width="60%" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent transactions skeleton */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <Skeleton height="1.25rem" width="200px" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-2">
                  <Skeleton height="1rem" width="200px" />
                  <Skeleton height="0.875rem" width="150px" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton height="1rem" width="80px" />
                  <Skeleton height="1.5rem" width="100px" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor your payment performance and key metrics</p>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat: any, idx: number) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Provider performance */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Provider Performance</h2>
            <p className="text-sm text-slate-600 mt-1">Last 7 days overview across all payment providers</p>
          </div>
          <Button variant="outline" size="sm" icon={ExternalLink}>
            View Details
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.providerStats.map((stat: any, idx: number) => (
            <Card key={idx} hover className="p-6 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: stat.color }}
                  />
                  <h3 className="font-bold text-slate-900 text-lg">{stat.provider}</h3>
                </div>
                <Button variant="ghost" size="sm" icon={Eye} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Volume</span>
                  <span className="font-bold text-slate-900 text-lg">{stat.volume}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Transactions</span>
                  <span className="font-semibold text-slate-900">{stat.transactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Success Rate</span>
                  <span className="font-bold text-emerald-600">{stat.successRate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-sm text-slate-600 mt-1">Latest payment activity across all providers</p>
          </div>
          <Button variant="outline" size="sm" icon={ExternalLink}>
            View All
          </Button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {data.recentTransactions.map((txn: any) => (
            <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-600">
                      {txn.customer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm truncate">{txn.customer}</p>
                    <p className="text-xs text-slate-500">{txn.provider} • {txn.date}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="font-bold text-slate-900 mb-1">{txn.amount}</p>
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                  statusColors[txn.status as keyof typeof statusColors]
                }`}>
                  {txn.status.toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;