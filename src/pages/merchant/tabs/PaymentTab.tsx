import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/common/Card';
import { AlertTriangle, Copy, KeyRound, RefreshCw, Save, Server, ShieldCheck, Trash2, Webhook, Workflow } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../contexts/ToastContext';
import { merchantService } from '../../../services/merchantService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { getErrorMessage } from '../../../utils/errorHandler';
import { env } from '../../../config/env';

const SAMPLE_REQUEST = `POST /api/v1/payments
Host: api.paybridge.example
Content-Type: application/json
x-api-key: YOUR_MERCHANT_API_KEY
Idempotency-Key: 3c4d91f0-57f8-40fc-aef8-e6fc20626f9f

{
  "amount": 5000,
  "currency": "NGN",
  "description": "Order #1042",
  "email": "customer@example.com",
  "provider": "paystack",
  "redirectUrl": "https://merchant.example.com/payments/return",
  "transactionReference": "order-1042"
}`;

const NODE_SAMPLE = `await fetch('https://your-paybridge-domain/api/v1/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.PAYBRIDGE_API_KEY,
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'NGN',
    description: 'Order #1042',
    email: customer.email,
    provider: 'paystack',
    redirectUrl: 'https://yourstore.com/payments/return',
    transactionReference: order.reference,
  }),
});`;

const DEVELOPER_HANDOFF = `Please integrate our server with PayBridge.

1) Use the Test API key first (from PayBridge dashboard).
2) Create payments from our backend endpoint:
   POST /api/v1/payments
   Headers: x-api-key, Idempotency-Key
3) Optionally set provider per request (stripe/paystack).
4) Configure webhooks:
   - /api/v1/webhooks/stripe
   - /api/v1/webhooks/paystack
5) Move to Live API key after successful testing.`;

export const PaymentsTab: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [revealedKey, setRevealedKey] = useState<{ mode: 'TEST' | 'LIVE'; label: string; key: string } | null>(null);
  const [webhookSecretInput, setWebhookSecretInput] = useState<{ stripe: string; paystack: string }>({
    stripe: '',
    paystack: '',
  });
  const webhookBaseUrl = env.apiUrl.replace(/\/api\/v1\/?$/, '');

  const {
    data: apiKeys = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['merchant-api-keys'],
    queryFn: () => merchantService.getApiKeys(),
    staleTime: 30 * 1000,
  });

  const {
    data: webhookSecrets,
    isLoading: webhookSecretsLoading,
    error: webhookSecretsError,
  } = useQuery({
    queryKey: ['merchant-webhook-secrets'],
    queryFn: async () => {
      const [stripe, paystack] = await Promise.all([
        merchantService.getWebhookSecret('stripe'),
        merchantService.getWebhookSecret('paystack'),
      ]);
      return { stripe, paystack };
    },
    staleTime: 30 * 1000,
  });

  const keyByMode = useMemo(
    () => ({
      TEST: apiKeys.find((item) => item.mode === 'TEST'),
      LIVE: apiKeys.find((item) => item.mode === 'LIVE'),
    }),
    [apiKeys]
  );

  const generateMutation = useMutation({
    mutationFn: (mode: 'TEST' | 'LIVE') => merchantService.generateApiKey(mode),
    onSuccess: (data) => {
      setRevealedKey({ mode: data.mode, label: data.label, key: data.key });
      queryClient.invalidateQueries({ queryKey: ['merchant-api-keys'] });
      showToast(`${data.label} generated. Next: copy it and store it in your backend secrets manager.`, 'success');
    },
    onError: (mutationError) => {
      showToast(getErrorMessage(mutationError), 'error');
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: 'test' | 'live') => merchantService.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-api-keys'] });
      showToast('API key revoked. Next: generate a replacement key before processing new payments.', 'success');
      setRevealedKey(null);
    },
    onError: (mutationError) => {
      showToast(getErrorMessage(mutationError), 'error');
    },
  });

  const webhookSecretMutation = useMutation({
    mutationFn: ({ provider, secret, rotate }: { provider: 'stripe' | 'paystack'; secret: string; rotate: boolean }) => {
      if (rotate) {
        return merchantService.rotateWebhookSecret(provider, secret);
      }
      return merchantService.setWebhookSecret(provider, secret);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['merchant-webhook-secrets'] });
      setWebhookSecretInput((previous) => ({ ...previous, [variables.provider]: '' }));
      showToast(
        `Webhook secret ${variables.rotate ? 'rotated' : 'saved'} for ${variables.provider}. Next: confirm the same secret in your provider dashboard.`,
        'success'
      );
    },
    onError: (mutationError) => {
      showToast(getErrorMessage(mutationError), 'error');
    },
  });

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast('Copied. Next: share or store it in your backend config.', 'success');
    } catch {
      showToast('Copy failed. Copy manually from the field.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Payment API Integration</h1>
        <p className="ui-page-subtitle mt-1">
          Configure keys and webhooks here. Next: your developer completes backend integration.
        </p>
      </div>

      {error && (
        <InlineAlert variant="error" icon={AlertTriangle} className="bg-red-50 border-red-300 text-red-800">
          Unable to load API keys. Try refreshing this page.
        </InlineAlert>
      )}

      {webhookSecretsError && (
        <InlineAlert variant="error" icon={AlertTriangle} className="bg-red-50 border-red-300 text-red-800">
          Unable to load webhook secrets. Try refreshing this page.
        </InlineAlert>
      )}

      {revealedKey && (
        <InlineAlert variant="warning" icon={AlertTriangle}>
          <div className="space-y-3">
            <p className="font-semibold">Key ready. Next: copy it now and save it in your backend secrets manager.</p>
            <div className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs break-all">{revealedKey.key}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" icon={Copy} onClick={() => copyText(revealedKey.key)}>
                Copy Key
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRevealedKey(null)}>
                Hide Key
              </Button>
            </div>
          </div>
        </InlineAlert>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="ui-section-title">Share With Your Developer</h2>
          <Button variant="outline" size="sm" icon={Copy} onClick={() => copyText(DEVELOPER_HANDOFF)}>
            Copy
          </Button>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          Use this message to brief your developer clearly.
        </p>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">{DEVELOPER_HANDOFF}</pre>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound size={18} className="text-blue-600" />
          <h2 className="ui-section-title">API Keys</h2>
        </div>
        <p className="text-sm text-slate-600 mb-5">
          Keep keys on your server only. Never expose them in browser or mobile app code.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(['TEST', 'LIVE'] as const).map((mode) => {
            const record = keyByMode[mode];
            const label = mode === 'TEST' ? 'Test API Key' : 'Live API Key';
            const keyId = mode === 'TEST' ? 'test' : 'live';
            const hasKey = !!record?.active;

            return (
              <div key={mode} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{label}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasKey ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {hasKey ? 'Active' : 'Not Generated'}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs break-all min-h-[48px] flex items-center">
                  {hasKey ? record?.maskedKey : 'No key has been created yet'}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                    loading={generateMutation.isPending && generateMutation.variables === mode}
                    onClick={() => generateMutation.mutate(mode)}
                  >
                    {hasKey ? 'Rotate Key' : 'Generate Key'}
                  </Button>
                  {hasKey && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-700 hover:bg-red-50"
                      loading={revokeMutation.isPending && revokeMutation.variables === keyId}
                      onClick={() => {
                        const confirmed = window.confirm(`Revoke ${label}? Existing backend integrations using it will stop working immediately.`);
                        if (confirmed) {
                          revokeMutation.mutate(keyId);
                        }
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && <p className="text-sm text-slate-600 mt-4">Loading key status...</p>}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Server size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Server-to-Server</h2>
              <p className="ui-page-subtitle mt-1">Call Paybridge from your backend after order validation.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <ShieldCheck size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Keep Keys Private</h2>
              <p className="ui-page-subtitle mt-1">Never create payments directly from browser/client-side code.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Workflow size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Use Idempotency</h2>
              <p className="ui-page-subtitle mt-1">Send a unique <code>Idempotency-Key</code> per payment attempt.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Webhook size={18} className="text-violet-600" />
            <h2 className="ui-section-title">Webhook URLs</h2>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Add these URLs in your Stripe and Paystack dashboards so PayBridge can receive payment status updates.
        </p>
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Stripe webhook endpoint</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-slate-900 break-all">{webhookBaseUrl}/api/v1/webhooks/stripe</code>
              <Button
                variant="outline"
                size="sm"
                icon={Copy}
                onClick={() => copyText(`${webhookBaseUrl}/api/v1/webhooks/stripe`)}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
            <p className="text-xs text-slate-500 mb-1">Paystack webhook endpoint</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-slate-900 break-all">{webhookBaseUrl}/api/v1/webhooks/paystack</code>
              <Button
                variant="outline"
                size="sm"
                icon={Copy}
                onClick={() => copyText(`${webhookBaseUrl}/api/v1/webhooks/paystack`)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h2 className="ui-section-title">Webhook Secrets</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Save provider webhook secrets so PayBridge can verify incoming events for your account.
        </p>
        <div className="space-y-4">
          {(['stripe', 'paystack'] as const).map((provider) => {
            const item = webhookSecrets?.[provider];
            const isLoadingAction =
              webhookSecretMutation.isPending && webhookSecretMutation.variables?.provider === provider;

            return (
              <div key={provider} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 capitalize">{provider}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item?.configured
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item?.configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {provider === 'stripe'
                    ? 'Paste Stripe endpoint signing secret (starts with whsec_).'
                    : 'Set Paystack webhook secret. If omitted, PayBridge falls back to your Paystack secret key.'}
                </p>
                <div className="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs break-all min-h-[40px] flex items-center mt-3">
                  {item?.configured ? item?.maskedSecret || 'Configured' : 'No webhook secret saved'}
                </div>
                <input
                  type="password"
                  value={webhookSecretInput[provider]}
                  onChange={(event) =>
                    setWebhookSecretInput((previous) => ({ ...previous, [provider]: event.target.value }))
                  }
                  placeholder={`Enter ${provider} webhook secret`}
                  className="mt-3 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Save}
                    loading={isLoadingAction && !webhookSecretMutation.variables?.rotate}
                    disabled={!webhookSecretInput[provider].trim() || webhookSecretsLoading}
                    onClick={() =>
                      webhookSecretMutation.mutate({
                        provider,
                        secret: webhookSecretInput[provider].trim(),
                        rotate: false,
                      })
                    }
                  >
                    Save Secret
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={RefreshCw}
                    className="text-amber-700 hover:bg-amber-50"
                    loading={isLoadingAction && !!webhookSecretMutation.variables?.rotate}
                    disabled={!webhookSecretInput[provider].trim() || webhookSecretsLoading}
                    onClick={() =>
                      webhookSecretMutation.mutate({
                        provider,
                        secret: webhookSecretInput[provider].trim(),
                        rotate: true,
                      })
                    }
                  >
                    Rotate Secret
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="ui-section-title">HTTP Request Template</h2>
          <Button variant="outline" size="sm" icon={Copy} onClick={() => copyText(SAMPLE_REQUEST)}>
            Copy
          </Button>
        </div>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">{SAMPLE_REQUEST}</pre>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="ui-section-title">Node.js Example</h2>
          <Button variant="outline" size="sm" icon={Copy} onClick={() => copyText(NODE_SAMPLE)}>
            Copy
          </Button>
        </div>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">{NODE_SAMPLE}</pre>
      </Card>
    </div>
  );
};

export default PaymentsTab;
