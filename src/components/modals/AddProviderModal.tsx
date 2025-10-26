// src/components/modals/AddProviderModal.tsx
import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { FormModal } from './FormModal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProviderConfig) => void;
  loading?: boolean;
}

interface ProviderConfig {
  provider: string;
  [key: string]: string | boolean;
  webhookSecret: string;
  testMode: boolean;
}

export const AddProviderModal: React.FC<AddProviderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const getProviderFields = (providerName: string) => {
    switch (providerName.toLowerCase()) {
      case 'stripe':
        return [
          { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_test_...' },
          { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_test_...' }
        ];
      case 'paystack':
        return [
          { key: 'publicKey', label: 'Public Key', placeholder: 'pk_test_...' },
          { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_test_...' }
        ];
      case 'flutterwave':
        return [
          { key: 'clientId', label: 'Client ID', placeholder: 'FLWPUBK_TEST-...' },
          { key: 'clientSecret', label: 'Client Secret', placeholder: 'FLWSECK_TEST-...' },
          { key: 'encryptionKey', label: 'Encryption Key', placeholder: 'FLWSECK_TEST...' }
        ];
      default:
        return [
          { key: 'apiKey', label: 'API Key', placeholder: 'Enter API key' }
        ];
    }
  };

  const [formData, setFormData] = useState<ProviderConfig>(() => {
    const initialData: ProviderConfig = {
      provider: '',
      webhookSecret: '',
      testMode: true
    };
    return initialData;
  });

  const providerFields = getProviderFields(formData.provider);

  const [showApiKey] = useState(false);

  const availableProviders = [
    { value: '', label: 'Select a provider...' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'flutterwave', label: 'Flutterwave' },
    { value: 'paystack', label: 'Paystack' }
  ];

  const getWebhookUrl = () => {
    if (!formData.provider) return '';
    return `https://api.paybridge.com/webhooks/${formData.provider}`;
  };

  const getProviderDocs = () => {
    const docs = {
      stripe: 'https://stripe.com/docs/api',
      flutterwave: 'https://developer.flutterwave.com/docs',
      paystack: 'https://paystack.com/docs/api/'
    };
    return docs[formData.provider as keyof typeof docs] || '#';
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add Payment Provider"
      submitText="Add Provider"
      loading={loading}
      size="lg"
    >
      <div className="space-y-5">
        <Select
          label="Payment Provider"
          value={formData.provider}
          onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
          options={availableProviders}
          required
        />

        {formData.provider && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-900">Setup Instructions</p>
                  <p className="text-xs text-blue-700 mt-1">
                    1. Get your {providerFields.map(f => f.label.toLowerCase()).join(', ')} from your {formData.provider} dashboard<br/>
                    2. Configure the webhook URL: <code className="bg-blue-100 px-1 rounded">{getWebhookUrl()}</code><br/>
                    3. Test the connection before going live
                  </p>
                  <a 
                    href={getProviderDocs()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                  >
                    View {formData.provider} documentation →
                  </a>
                </div>
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="testMode"
                checked={formData.testMode}
                onChange={(e) => setFormData(prev => ({ ...prev, testMode: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="testMode" className="text-sm font-medium text-slate-700">
                Enable test mode (recommended for initial setup)
              </label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium text-amber-900">Important</p>
                  <p className="text-xs text-amber-700 mt-1">
                    After adding this provider, it will be available for payment routing. 
                    Make sure to test thoroughly before processing live transactions.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </FormModal>
  );
};