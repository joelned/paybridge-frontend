import React, { useState, useMemo } from 'react';
import { Plus, RefreshCw, MoreHorizontal, CheckCircle, AlertTriangle, Search, Activity } from 'lucide-react';
import { useModalContext } from '../../../contexts/ModalContext';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { DebouncedSearchInput } from '../../../components/common/DebouncedSearchInput';
import { useSearchState } from '../../../hooks/useSearchState';

export const ProvidersTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { debouncedQuery, handleSearch, isSearching } = useSearchState({ delay: 300 });
  const [providers] = useState([
    { 
      id: 'stripe', 
      name: 'Stripe', 
      status: 'ACTIVE',
      transactions: 1234,
      volume: 45234,
      successRate: 99.2,
      responseTime: 245,
      health: 'excellent',
      color: '#6366f1'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      status: 'ACTIVE',
      transactions: 856,
      volume: 38129,
      successRate: 97.8,
      responseTime: 312,
      health: 'good',
      color: '#10b981'
    },
    { 
      id: 'flutterwave', 
      name: 'Flutterwave', 
      status: 'INACTIVE',
      transactions: 0,
      volume: 0,
      successRate: 0,
      responseTime: 0,
      health: 'disconnected',
      color: '#f59e0b'
    }
  ]);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => 
      provider.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [providers, debouncedQuery]);

  const activeProviders = filteredProviders.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Clean header with primary action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Providers</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your payment processing connections</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw}>
            Sync Status
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => openModal('addProvider')}>
            Add Provider
          </Button>
        </div>
      </div>

      {/* Quick status overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{activeProviders}</p>
              <p className="text-sm font-medium text-slate-600">Active Providers</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-600 font-medium">All operational</span>
              </div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{providers.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Connected</p>
              <p className="text-xs text-slate-500">Across all gateways</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <div className="w-5 h-5 bg-indigo-600 rounded-full" />
            </div>
          </div>
        </Card>
        <Card className="p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">98.5%</p>
              <p className="text-sm font-medium text-slate-600">Success Rate</p>
              <p className="text-xs text-slate-500">Last 30 days</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white" size={12} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Provider cards with clear status and minimal actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Connected Providers</h2>
          <div className="flex items-center gap-2">
            <DebouncedSearchInput
              placeholder="Search providers..."
              onSearch={handleSearch}
              delay={300}
              className="w-48"
              isLoading={isSearching}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.name[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      provider.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{provider.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        provider.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          provider.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        {provider.status === 'ACTIVE' ? 'Connected' : 'Inactive'}
                      </span>
                      {provider.status === 'ACTIVE' && (
                        <span className="text-xs text-slate-500">{provider.responseTime}ms avg</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg transition-all">
                  <MoreHorizontal size={16} className="text-slate-500" />
                </button>
              </div>

              {/* Key metrics in clean layout */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">
                    ${provider.volume > 0 ? (provider.volume / 1000).toFixed(0) + 'K' : '0'}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Volume</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">
                    {provider.transactions.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Transactions</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    provider.successRate > 95 ? 'text-emerald-600' : 
                    provider.successRate > 90 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {provider.successRate > 0 ? provider.successRate.toFixed(1) + '%' : 'N/A'}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">Success</p>
                </div>
              </div>

              {/* Minimal action buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openModal('viewProviderDashboard', { provider })}
                >
                  Analytics
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openModal('updateProvider', { provider })}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Clean activity feed */}
      <Card>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Live</span>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mt-0.5">
                <CheckCircle className="text-emerald-600" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Stripe webhook verified</p>
                <p className="text-xs text-slate-500 mt-1">Connection health check passed • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mt-0.5">
                <Activity className="text-indigo-600" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">PayPal transaction processed</p>
                <p className="text-xs text-slate-500 mt-1">$249.00 payment completed • 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mt-0.5">
                <AlertTriangle className="text-amber-600" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Flutterwave connection idle</p>
                <p className="text-xs text-slate-500 mt-1">No activity detected • 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProvidersTab;