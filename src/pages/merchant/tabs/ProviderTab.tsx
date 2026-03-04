import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, PlugZap, RefreshCw, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { providerService, type SupportedProviderName } from '../../../services/providerService';
import { getErrorMessage } from '../../../utils/errorHandler';

type ConfiguredProvider = {
  configId: number;
  providerName: string;
  providerCode: string;
  enabled: boolean;
  lastVerifiedAt?: string;
  createdAt?: string;
};

const PROVIDER_OPTIONS = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paystack', label: 'Paystack' },
];

export const ProvidersTab: React.FC = () => {
  const [providerName, setProviderName] = useState<SupportedProviderName>('stripe');
  const [secretKey, setSecretKey] = useState('');
  const [testOnConfigure, setTestOnConfigure] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingConfigId, setIsTestingConfigId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    data: configuredProviders = [],
    isLoading,
    error: loadError,
    refetch,
  } = useQuery<ConfiguredProvider[]>({
    queryKey: ['configured-providers'],
    queryFn: () => providerService.getConfiguredProviders(),
  });

  const canSubmit = useMemo(() => secretKey.trim().length > 0, [secretKey]);

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await providerService.configureProvider({
        name: providerName,
        config: { secretKey: secretKey.trim() },
        testConnection: testOnConfigure,
      });

      setSuccessMessage(`${response.provider} configured successfully.`);
      setSecretKey('');
      await refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetest = async (configId: number) => {
    setError('');
    setSuccessMessage('');
    setIsTestingConfigId(configId);

    try {
      const result = await providerService.testProvider(configId);
      setSuccessMessage(result.message || `Connection test passed for config #${configId}.`);
      await refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsTestingConfigId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connect Payment Methods</h1>
        <p className="text-sm text-slate-600 mt-1">
          Add your Stripe or Paystack account so you can receive customer payments.
        </p>
      </div>

      {error && (
        <InlineAlert
          variant="error"
          icon={ShieldAlert}
          className="bg-red-50 border-red-300 text-red-800"
        >
          {error}
        </InlineAlert>
      )}

      {loadError && (
        <InlineAlert
          variant="error"
          icon={ShieldAlert}
          className="bg-red-50 border-red-300 text-red-800"
        >
          {getErrorMessage(loadError)}
        </InlineAlert>
      )}

      {successMessage && (
        <InlineAlert variant="success" icon={CheckCircle2}>
          {successMessage}
        </InlineAlert>
      )}

      <Card className="p-6">
        <div className="mb-4 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
          You can find your secret key in your payment provider dashboard. We use it only to connect your account.
        </div>
        <form onSubmit={handleConfigure} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payment Company"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value as SupportedProviderName)}
              options={PROVIDER_OPTIONS}
              required
            />
            <Input
              label="Secret Key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={providerName === 'stripe' ? 'sk_test_...' : 'sk_test_paystack_...'}
              required
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={testOnConfigure}
              onChange={(e) => setTestOnConfigure(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Check connection now
          </label>

          <Button type="submit" variant="primary" icon={PlugZap} disabled={isSubmitting || !canSubmit} loading={isSubmitting}>
            Connect Account
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Connected Accounts</h2>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading connected providers...</p>
        ) : configuredProviders.length === 0 ? (
          <p className="text-sm text-slate-600">No providers configured yet.</p>
        ) : (
          <div className="space-y-3">
            {configuredProviders.map((config) => (
              <div key={config.configId} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{config.providerName}</p>
                  <p className="text-xs text-slate-600">{config.enabled ? 'Active' : 'Inactive'}</p>
                  <p className="text-xs text-slate-500">Connected: {config.createdAt ? new Date(config.createdAt).toLocaleString() : 'N/A'}</p>
                  {config.lastVerifiedAt && (
                    <p className="text-xs text-slate-600 mt-1">
                      Last connection check: {new Date(config.lastVerifiedAt).toLocaleString()}
                    </p>
                  )}
                  <details className="mt-2">
                    <summary className="text-xs text-slate-500 cursor-pointer">Technical details</summary>
                    <p className="text-xs text-slate-500 mt-1">Reference ID: {config.configId}</p>
                    <p className="text-xs text-slate-500 mt-1">Code: {config.providerCode}</p>
                  </details>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => handleRetest(config.configId)}
                  disabled={isTestingConfigId === config.configId}
                  loading={isTestingConfigId === config.configId}
                >
                  Check Again
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProvidersTab;
