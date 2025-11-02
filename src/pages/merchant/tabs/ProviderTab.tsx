import React, { useState } from 'react';
import { Plus, RefreshCw, MoreHorizontal, CheckCircle, AlertTriangle, Zap, TrendingUp, Activity } from 'lucide-react';
import { useModalContext } from '../../../contexts/ModalContext';

export const ProvidersTab: React.FC = () => {
  const { openModal } = useModalContext();
  const [providers] = useState([
    { 
      id: 'stripe', 
      name: 'Stripe', 
      status: 'ACTIVE',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=40&h=40&fit=crop&crop=center',
      transactions: 1234,
      volume: 45234,
      successRate: 99.2,
      responseTime: 245,
      lastUsed: '2 hours ago',
      health: 'excellent',
      color: '#6366f1'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      status: 'ACTIVE',
      logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=40&h=40&fit=crop&crop=center',
      transactions: 856,
      volume: 38129,
      successRate: 97.8,
      responseTime: 312,
      lastUsed: '1 hour ago',
      health: 'good',
      color: '#10b981'
    },
    { 
      id: 'flutterwave', 
      name: 'Flutterwave', 
      status: 'INACTIVE',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop&crop=center',
      transactions: 0,
      volume: 0,
      successRate: 0,
      responseTime: 0,
      lastUsed: 'Never',
      health: 'disconnected',
      color: '#f59e0b'
    }
  ]);

  const totalVolume = providers.reduce((sum, p) => sum + p.volume, 0);
  const activeProviders = providers.filter(p => p.status === 'ACTIVE').length;
  const avgSuccessRate = providers.filter(p => p.status === 'ACTIVE').reduce((sum, p) => sum + p.successRate, 0) / activeProviders;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-heading-1">Payment Providers</h1>
          <p className="text-body-large max-w-2xl">
            Orchestrate payments across multiple providers with intelligent routing and real-time monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-secondary">
            <RefreshCw size={18} />
            Sync Status
          </button>
          <button onClick={() => openModal('addProvider')} className="btn-primary">
            <Plus size={18} />
            Connect Provider
          </button>
        </div>
      </div>

      {/* Executive Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="metric-card group">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <p className="text-caption">Active Providers</p>
              <p className="text-4xl font-extrabold text-neutral-900">{activeProviders}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500"></div>
                <span className="text-body-small text-success-600 font-medium">All operational</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
              <CheckCircle size={28} className="text-success-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-success-600">
            <TrendingUp size={16} />
            <span className="text-sm font-semibold">+1 this month</span>
          </div>
        </div>
        
        <div className="metric-card group">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <p className="text-caption">Processing Volume</p>
              <p className="text-4xl font-extrabold text-neutral-900">${(totalVolume / 1000).toFixed(0)}K</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span className="text-body-small text-primary-600 font-medium">Last 30 days</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
              <Activity size={28} className="text-primary-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-success-600">
            <TrendingUp size={16} />
            <span className="text-sm font-semibold">+12.5% growth</span>
          </div>
        </div>
        
        <div className="metric-card group">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <p className="text-caption">Success Rate</p>
              <p className="text-4xl font-extrabold text-neutral-900">{avgSuccessRate.toFixed(1)}%</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500"></div>
                <span className="text-body-small text-success-600 font-medium">Industry leading</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
              <Zap size={28} className="text-success-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-success-600">
            <TrendingUp size={16} />
            <span className="text-sm font-semibold">+0.3% this week</span>
          </div>
        </div>
      </div>

      {/* Provider Ecosystem */}
      <div className="premium-card-elevated">
        <div className="p-8 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-heading-2">Provider Ecosystem</h2>
              <p className="text-body-small">Manage your payment processing infrastructure</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-success-50 rounded-full">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success-700">All systems operational</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <div key={provider.id} className="premium-card group cursor-pointer">
                <div className="p-6">
                  {/* Provider Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.name[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          provider.status === 'ACTIVE' ? 'bg-success-500' : 'bg-neutral-300'
                        }`}></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-heading-3">{provider.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`status-badge ${
                            provider.status === 'ACTIVE' ? 'status-success' : 'status-neutral'
                          }`}>
                            {provider.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="btn-ghost p-2">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-caption">Volume</p>
                        <p className="text-xl font-bold text-neutral-900">
                          ${provider.volume > 0 ? (provider.volume / 1000).toFixed(0) + 'K' : '0'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-caption">Transactions</p>
                        <p className="text-xl font-bold text-neutral-900">
                          {provider.transactions.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-caption">Success Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-success-600">
                            {provider.successRate > 0 ? provider.successRate.toFixed(1) + '%' : 'N/A'}
                          </p>
                          {provider.status === 'ACTIVE' && (
                            <CheckCircle size={16} className="text-success-500" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-caption">Response Time</p>
                        <p className="text-lg font-bold text-neutral-900">
                          {provider.responseTime > 0 ? provider.responseTime + 'ms' : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Health Indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-caption">Connection Health</span>
                      <span className={`text-sm font-semibold ${
                        provider.health === 'excellent' ? 'text-success-600' :
                        provider.health === 'good' ? 'text-warning-600' : 'text-error-600'
                      }`}>
                        {provider.health.charAt(0).toUpperCase() + provider.health.slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          provider.health === 'excellent' ? 'bg-success-500' :
                          provider.health === 'good' ? 'bg-warning-500' : 'bg-error-500'
                        }`}
                        style={{ 
                          width: provider.health === 'excellent' ? '100%' : 
                                provider.health === 'good' ? '75%' : '25%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => openModal('viewProviderDashboard', { provider })}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all duration-200 border border-neutral-200 hover:border-neutral-300"
                    >
                      Analytics
                    </button>
                    <button 
                      onClick={() => openModal('updateProvider', { provider })}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 border border-primary-200 hover:border-primary-300"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card-elevated">
          <div className="p-8 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-heading-3">Real-time Monitoring</h3>
                <p className="text-body-small">Live provider performance metrics</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            {providers.filter(p => p.status === 'ACTIVE').map((provider) => (
              <div key={provider.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{provider.name}</p>
                    <p className="text-xs text-neutral-500">API Response</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-neutral-900">{provider.responseTime}ms</span>
                    <CheckCircle size={16} className="text-success-500" />
                  </div>
                  <p className="text-xs text-success-600 font-medium">Optimal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card-elevated">
          <div className="p-8 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-heading-3">Activity Feed</h3>
                <p className="text-body-small">Recent provider events</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-success-500 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">Stripe webhook verified</p>
                <p className="text-xs text-neutral-500 mt-1">Connection health check passed • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">PayPal transaction processed</p>
                <p className="text-xs text-neutral-500 mt-1">$249.00 payment completed • 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-warning-500 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">Flutterwave connection idle</p>
                <p className="text-xs text-neutral-500 mt-1">No activity detected • 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersTab;