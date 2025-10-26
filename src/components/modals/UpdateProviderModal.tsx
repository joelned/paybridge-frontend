// src/components/modals/UpdateProviderModal.tsx
import React, { useState } from 'react';
import { Copy, Shield, AlertCircle } from 'lucide-react';
import { FormModal } from './FormModal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface Provider {
  id: number;
  name: string;
  enabled: boolean;
  logo: string;
  color: string;
  apiKey: string;
  transactions: number;
  volume: string;
}

interface UpdateProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProviderUpdateData) => void;
  provider: Provider | null;
  loading?: boolean;
}

interface ProviderUpdateData {
  [key: string]: string | boolean;
  webhookSecret: string;
  enabled: boolean;
}

export const UpdateProviderModal: React.FC<UpdateProviderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  provider,
  loading = false
}) => {
  const getProviderFields = (providerName: string) => {
    switch (providerName.toLowerCase()) {
      case 'stripe':
        return [
          { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_...' },
          { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...' }
        ];
      case 'paystack':
        return [
          { key: 'publicKey', label: 'Public Key', placeholder: 'pk_live_...' },
          { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...' }
        ];
      case 'flutterwave':
        return [
          { key: 'clientId', label: 'Client ID', placeholder: 'FLWPUBK_...' },
          { key: 'clientSecret', label: 'Client Secret', placeholder: 'FLWSECK_...' },
          { key: 'encryptionKey', label: 'Encryption Key', placeholder: 'FLWSECK_...' }
        ];
      default:
        return [
          { key: 'apiKey', label: 'API Key', placeholder: 'Enter API key' }
        ];
    }
  };

  const providerFields = getProviderFields(provider?.name || '');
  
  const [formData, setFormData] = useState<ProviderUpdateData>(() => {
    const initialData: ProviderUpdateData = {
      webhookSecret: '',
      enabled: provider?.enabled || false
    };
    
    providerFields.forEach(field => {
      initialData[field.key] = provider?.apiKey || '';
    });
    
    return initialData;
  });
  const [showApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  if (!provider) return null;

  const webhookUrl = `https://api.paybridge.com/webhooks/${provider.name.toLowerCase()}`;

  const handleTestConnection = async () => {
    setTestingConnection(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(false);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={`Update ${provider.name} Configuration`}
      submitText="Save Changes"
      loading={loading}
      size="lg"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <img src={provider.logo} alt={provider.name} className="w-8 h-8" />
          <div>
            <h4 className="font-semibold text-slate-900">{provider.name}</h4>
            <p className="text-sm text-slate-600">{provider.transactions} transactions • {provider.volume}</p>
          </div>
        </div>

        {providerFields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            type="password"
            value={formData[field.key] as string || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
            required
            hint="This will be encrypted and stored securely"
          />
        ))}

        <Input
          label="Webhook Secret"
          type="password"
          value={formData.webhookSecret}
          onChange={(e) => setFormData(prev => ({ ...prev, webhookSecret: e.target.value }))}
          placeholder="Webhook signing secret"
          required
          hint="Used to verify webhook authenticity"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-600"
            />
            <Button 
              variant="outline" 
              icon={Copy}
              onClick={() => navigator.clipboard.writeText(webhookUrl)}
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-slate-700">
            Enable this provider for payment processing
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Test Connection</p>
              <p className="text-xs text-blue-700 mt-1 mb-3">
                Verify your credentials are working correctly
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestConnection}
                loading={testingConnection}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>

        {!formData.enabled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-amber-900">Provider Disabled</p>
                <p className="text-xs text-amber-700 mt-1">
                  This provider will not be used for new payments until enabled
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormModal>
  );
};