import React, { useState } from 'react';
import { Eye, EyeOff, Copy, X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import type { Provider } from '../../../types';

export const ProvidersTab: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([
    { id: 1, name: 'Stripe', enabled: true, logo: '💳', color: '#635BFF', apiKey: 'sk_live_51H...', transactions: 543, volume: '$45,234' },
    { id: 2, name: 'PayPal', enabled: true, logo: '💰', color: '#00457C', apiKey: 'AZaQ...', transactions: 412, volume: '$38,129' },
    { id: 3, name: 'Flutterwave', enabled: true, logo: '🦋', color: '#F5A623', apiKey: 'FLWSECK...', transactions: 329, volume: '$41,200' },
    { id: 4, name: 'Paystack', enabled: false, logo: '💎', color: '#00C3F7', apiKey: '', transactions: 0, volume: '$0' },
    { id: 5, name: 'Razorpay', enabled: false, logo: '⚡', color: '#3395FF', apiKey: '', transactions: 0, volume: '$0' }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleConfigureProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setApiKey(provider.apiKey);
    setWebhookSecret('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Providers</h2>
        <p className="text-sm text-gray-600 mt-1">Connect and manage your payment provider integrations</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{provider.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <Badge variant={provider.enabled ? 'success' : 'default'}>
                    {provider.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {provider.enabled && (
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions</span>
                  <span className="font-semibold text-gray-900">{provider.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-semibold text-gray-900">{provider.volume}</span>
                </div>
              </div>
            )}
            
            <Button 
              variant={provider.enabled ? 'outline' : 'primary'} 
              className="w-full"
              onClick={() => handleConfigureProvider(provider)}
            >
              {provider.enabled ? 'Configure' : 'Enable'}
            </Button>
          </Card>
        ))}
      </div>

      {selectedProvider && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Configure {selectedProvider.name}
            </h3>
            <button onClick={() => setSelectedProvider(null)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-2.5 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Webhook signing secret"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`https://api.paybridge.com/webhooks/${selectedProvider.name.toLowerCase()}`}
                  readOnly
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg"
                />
                <Button variant="outline" icon={Copy}>Copy</Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Configure this URL in your {selectedProvider.name} dashboard</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-amber-900">Smart Routing</p>
                  <p className="text-xs text-amber-700 mt-1">
                    When enabled, PayBridge will automatically route payments to this provider based on success rates, fees, and availability
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button>Save Configuration</Button>
              <Button variant="outline" onClick={() => setSelectedProvider(null)}>Cancel</Button>
              {selectedProvider.enabled && (
                <Button variant="danger">Disable Provider</Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};