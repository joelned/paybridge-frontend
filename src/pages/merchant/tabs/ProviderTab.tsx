import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, PlugZap, RefreshCw, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { ResponsiveDataTable, type Column } from '../../../components/common/ResponsiveDataTable';
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
  const providerRows = useMemo(() => configuredProviders, [configuredProviders]);

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

  const handleRetest = useCallback(async (configId: number) => {
    setError('');
    setSuccessMessage('');
    setIsTestingConfigId(configId);

    try {
      const result = await providerService.testProvider(configId);
      setSuccessMessage(result.message || 'Connection test passed successfully.');
      await refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsTestingConfigId(null);
    }
  }, [refetch]);

  const providerColumns = useMemo<Column<ConfiguredProvider>[]>(() => [
    {
      key: 'providerName',
      header: 'Provider',
      mobileLabel: 'Provider',
      render: (_value, item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.providerName}</p>
          <p className="text-xs text-slate-600 mt-0.5">
            Code: {item.providerCode}
          </p>
        </div>
      ),
    },
    {
      key: 'enabled',
      header: 'Status',
      mobileLabel: 'Status',
      render: (_value, item) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {item.enabled ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Connected',
      mobileLabel: 'Connected',
      render: (_value, item) => (
        <span className="text-sm text-slate-700">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</span>
      ),
    },
    {
      key: 'lastVerifiedAt',
      header: 'Last Check',
      mobileLabel: 'Last Check',
      render: (_value, item) => (
        <span className="text-sm text-slate-700">{item.lastVerifiedAt ? new Date(item.lastVerifiedAt).toLocaleString() : 'Never'}</span>
      ),
    },
    {
      key: 'configId',
      header: 'Action',
      mobileLabel: 'Action',
      render: (_value, item) => (
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={() => handleRetest(item.configId)}
          disabled={isTestingConfigId === item.configId}
          loading={isTestingConfigId === item.configId}
        >
          Check Again
        </Button>
      ),
    },
  ], [handleRetest, isTestingConfigId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Connect Payment Methods</h1>
        <p className="ui-page-subtitle mt-1">
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

      {successMessage && (
        <InlineAlert
          variant="success"
          icon={CheckCircle2}
          className="bg-emerald-50 border-emerald-300 text-emerald-800"
        >
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
        <h2 className="ui-section-title mb-4">Connected Accounts</h2>
        <ResponsiveDataTable
          data={providerRows}
          columns={providerColumns}
          loading={isLoading}
          error={loadError ? getErrorMessage(loadError) : undefined}
          onRetry={() => refetch()}
          emptyMessage="No providers configured yet."
          keyExtractor={(item) => String(item.configId)}
        />
      </Card>
    </div>
  );
};

export default ProvidersTab;
