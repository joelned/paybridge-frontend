import React, { useMemo, useCallback } from 'react';
import { useProviders } from '../../hooks/queries/useProviders';
import { formatCurrency } from '../../utils/currencyFormatter';

interface ProviderCardProps {
  provider: any;
  onToggle: (id: string, enabled: boolean) => void;
}

const ProviderCard = React.memo(({ provider, onToggle }: ProviderCardProps) => {
  const handleToggle = useCallback(() => {
    onToggle(provider.id, !provider.enabled);
  }, [provider.id, provider.enabled, onToggle]);

  // Memoize provider calculations
  const stats = useMemo(() => {
    const successRate = provider.totalTransactions > 0 
      ? (provider.successfulTransactions / provider.totalTransactions) * 100 
      : 0;
    
    const avgAmount = provider.totalTransactions > 0
      ? provider.totalAmount / provider.totalTransactions
      : 0;

    return {
      successRate: successRate.toFixed(1),
      avgAmount: formatCurrency(avgAmount, 'USD'),
      totalVolume: formatCurrency(provider.totalAmount, 'USD')
    };
  }, [provider.totalTransactions, provider.successfulTransactions, provider.totalAmount]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={provider.logo} 
            alt={provider.name}
            className="w-10 h-10 rounded"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-500">{provider.type}</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            provider.enabled
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {provider.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgAmount}</p>
          <p className="text-xs text-gray-500">Avg Amount</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalVolume}</p>
          <p className="text-xs text-gray-500">Total Volume</p>
        </div>
      </div>
    </div>
  );
});

ProviderCard.displayName = 'ProviderCard';

export const OptimizedProvidersTab = React.memo(() => {
  const { data: providers = [], isLoading, mutate } = useProviders();

  const handleProviderToggle = useCallback(async (id: string, enabled: boolean) => {
    try {
      // Optimistic update
      mutate(
        providers.map(p => p.id === id ? { ...p, enabled } : p),
        false
      );
      
      // API call would go here
      // await updateProvider(id, { enabled });
      
      // Revalidate
      mutate();
    } catch (error) {
      console.error('Failed to update provider:', error);
      // Revert optimistic update
      mutate();
    }
  }, [providers, mutate]);

  // Memoize filtered and sorted providers
  const { enabledProviders, disabledProviders } = useMemo(() => {
    const enabled = providers.filter(p => p.enabled);
    const disabled = providers.filter(p => !p.enabled);
    
    return {
      enabledProviders: enabled.sort((a, b) => b.totalAmount - a.totalAmount),
      disabledProviders: disabled.sort((a, b) => a.name.localeCompare(b.name))
    };
  }, [providers]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enabled Providers */}
      {enabledProviders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Active Providers ({enabledProviders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enabledProviders.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onToggle={handleProviderToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Disabled Providers */}
      {disabledProviders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Inactive Providers ({disabledProviders.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disabledProviders.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onToggle={handleProviderToggle}
              />
            ))}
          </div>
        </div>
      )}

      {providers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No providers configured</p>
        </div>
      )}
    </div>
  );
});

OptimizedProvidersTab.displayName = 'OptimizedProvidersTab';