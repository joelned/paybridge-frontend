import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { merchantService } from '../../../services/merchantService';
import { providerService } from '../../../services/providerService';
import { getErrorMessage } from '../../../utils/errorHandler';
import { formatStatus } from '../../../utils/formatters';
import { CheckCircle2, Circle, CreditCard, KeyRound, PlugZap, Rocket, ShieldAlert, Store } from 'lucide-react';

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  actionLabel?: string;
  actionPath?: string;
};

export const OverviewTab: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['merchant-profile'],
    queryFn: () => merchantService.getMerchantProfile(),
    staleTime: 60 * 1000,
  });

  const {
    data: configuredProviders = [],
    isLoading: providersLoading,
    error: providersError,
  } = useQuery({
    queryKey: ['configured-providers'],
    queryFn: () => providerService.getConfiguredProviders(),
    staleTime: 30 * 1000,
  });

  const {
    data: apiKeys = [],
    isLoading: keysLoading,
    error: keysError,
  } = useQuery({
    queryKey: ['merchant-api-keys'],
    queryFn: () => merchantService.getApiKeys(),
    staleTime: 30 * 1000,
  });

  const activeProviderCount = configuredProviders.filter((item) => item.enabled).length;
  const testKey = apiKeys.find((item) => item.mode === 'TEST' && item.active);
  const liveKey = apiKeys.find((item) => item.mode === 'LIVE' && item.active);

  const checklist = useMemo<ChecklistItem[]>(() => {
    const accountActive = profile?.status === 'ACTIVE';

    return [
      {
        id: 'account',
        title: 'Account is active',
        description: accountActive
          ? 'Your merchant account is active and ready for payment setup.'
          : `Current status: ${profile?.status ? formatStatus(profile.status) : 'Unknown'}.`,
        done: accountActive,
        actionLabel: 'Open Settings',
        actionPath: '/merchant/settings',
      },
      {
        id: 'provider',
        title: 'At least one provider is connected',
        description:
          activeProviderCount > 0
            ? `${activeProviderCount} provider${activeProviderCount > 1 ? 's are' : ' is'} connected.`
            : 'Connect Stripe or Paystack to start receiving payments.',
        done: activeProviderCount > 0,
        actionLabel: 'Open Providers',
        actionPath: '/merchant/providers',
      },
      {
        id: 'test-key',
        title: 'Test API key created',
        description: testKey
          ? 'Your test key is active. Use it first in a safe test environment.'
          : 'Create a test key for your developer to integrate and test checkout.',
        done: !!testKey,
        actionLabel: 'Open Integration',
        actionPath: '/merchant/payments',
      },
      {
        id: 'live-key',
        title: 'Live API key ready for launch',
        description: liveKey
          ? 'Your live key is active. You are ready for production traffic.'
          : 'Generate a live key when you are ready to go live.',
        done: !!liveKey,
        actionLabel: 'Open Integration',
        actionPath: '/merchant/payments',
      },
    ];
  }, [activeProviderCount, liveKey, profile?.status, testKey]);

  const completedCount = checklist.filter((item) => item.done).length;
  const loading = profileLoading || providersLoading || keysLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Integration Readiness</h1>
        <p className="ui-page-subtitle mt-1">
          PayBridge helps you integrate once, then route payments across providers.
        </p>
      </div>

      {(profileError || providersError || keysError) && (
        <InlineAlert variant="error" icon={ShieldAlert} className="bg-red-50 border-red-300 text-red-800">
          {getErrorMessage(profileError || providersError || keysError)}
        </InlineAlert>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="ui-section-title">Setup Checklist</h2>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {completedCount}/4 complete
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Loading setup status...</p>
        ) : (
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="ui-page-subtitle mt-1">{item.description}</p>
                  </div>
                </div>

                {item.actionPath && item.actionLabel && (
                  <Button variant="outline" size="sm" onClick={() => navigate(item.actionPath!)}>
                    {item.actionLabel}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Store size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">For Merchants</h2>
              <p className="ui-page-subtitle mt-1">
                Use this dashboard to connect providers and manage keys. Your developer handles code integration.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Rocket size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Go-live Path</h2>
              <p className="ui-page-subtitle mt-1">
                Connect a provider, test with test key, then switch to live key when your checkout is ready.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <PlugZap size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Provider Routing</h2>
              <p className="ui-page-subtitle mt-1">
                Your backend can choose a provider per payment request, or rely on configured default behavior.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <KeyRound size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Key Security</h2>
              <p className="ui-page-subtitle mt-1">
                API keys are shown once for security. Rotate immediately if you suspect exposure.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={18} className="text-slate-700" />
          <h2 className="font-semibold text-slate-900">Important</h2>
        </div>
        <p className="text-sm text-slate-600">
          Payment creation is intentionally not done from this dashboard. It should happen from your ecommerce server using your PayBridge API key.
        </p>
      </Card>
    </div>
  );
};

export default OverviewTab;
