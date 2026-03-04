import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, CheckCircle2, Clock3, Download, TrendingUp, XCircle } from 'lucide-react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { useModalContext } from '../../../contexts/ModalContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { merchantService } from '../../../services/merchantService';
import { fxService } from '../../../services/fxService';
import { getErrorMessage } from '../../../utils/errorHandler';

const RANGE_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last 1 year' },
];

const formatAmount = (amount: number, currency: string) => {
  if (!Number.isFinite(amount)) {
    return '-';
  }

  if (!currency || currency === 'N/A') {
    return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
  }
};

export const AnalyticsTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { selectedCurrency } = useCurrency();
  const [days, setDays] = useState<number>(30);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['merchant-analytics', days],
    queryFn: () => merchantService.getMerchantAnalytics(days),
    staleTime: 60 * 1000,
  });

  const baseCurrency = data?.primaryCurrency && data.primaryCurrency !== 'N/A'
    ? data.primaryCurrency
    : undefined;

  const {
    data: fxRate,
    error: fxError,
    isLoading: isFxLoading,
  } = useQuery({
    queryKey: ['fx-rate', baseCurrency, selectedCurrency.code],
    queryFn: () => fxService.getConversionRate(baseCurrency as string, selectedCurrency.code),
    enabled: Boolean(baseCurrency && selectedCurrency.code && baseCurrency !== selectedCurrency.code),
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const effectiveRate = useMemo(() => {
    if (!baseCurrency || !selectedCurrency.code) {
      return undefined;
    }
    if (baseCurrency === selectedCurrency.code) {
      return 1;
    }
    return fxRate?.rate;
  }, [baseCurrency, selectedCurrency.code, fxRate?.rate]);

  const convertedTotalProcessed = useMemo(() => {
    if (!data || typeof effectiveRate !== 'number') {
      return undefined;
    }
    return data.totalProcessedAmount * effectiveRate;
  }, [data, effectiveRate]);

  const convertedAverage = useMemo(() => {
    if (!data || typeof effectiveRate !== 'number') {
      return undefined;
    }
    return data.averageTransactionAmount * effectiveRate;
  }, [data, effectiveRate]);

  const trendSummary = useMemo(() => {
    if (!data?.dailyTrend?.length) {
      return { latest: 0, previous: 0, direction: 'flat' as 'up' | 'down' | 'flat' };
    }

    const latest = data.dailyTrend[data.dailyTrend.length - 1]?.transactions || 0;
    const previous = data.dailyTrend[data.dailyTrend.length - 2]?.transactions || 0;

    if (latest > previous) return { latest, previous, direction: 'up' as const };
    if (latest < previous) return { latest, previous, direction: 'down' as const };
    return { latest, previous, direction: 'flat' as const };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">
            High-level performance across all your connected payment providers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" icon={Download} onClick={() => openModal('exportData', { type: 'analytics' })}>
            Export
          </Button>
        </div>
      </div>

      {error && (
        <InlineAlert variant="error" className="bg-red-50 border-red-300 text-red-800">
          {getErrorMessage(error)}
        </InlineAlert>
      )}

      {fxError && (
        <InlineAlert variant="error" className="bg-red-50 border-red-300 text-red-800">
          {getErrorMessage(fxError)}
        </InlineAlert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-slate-600">Total Transactions</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{isLoading ? '...' : data?.totalTransactions ?? 0}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <BarChart3 size={14} />
            <span>{days}-day window</span>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-600">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{isLoading ? '...' : `${data?.successRate ?? 0}%`}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>{isLoading ? '...' : `${data?.successfulTransactions ?? 0} successful`}</span>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-600">Failed / Cancelled</p>
          <p className="text-2xl font-bold text-red-700 mt-2">{isLoading ? '...' : data?.failedTransactions ?? 0}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <XCircle size={14} className="text-red-600" />
            <span>Needs attention</span>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-2xl font-bold text-amber-700 mt-2">{isLoading ? '...' : data?.pendingTransactions ?? 0}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <Clock3 size={14} className="text-amber-600" />
            <span>Awaiting final status</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Revenue Summary</h2>
          <p className="text-sm text-slate-600 mt-1">Processed amount and averages for the selected period.</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total Processed</p>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {isLoading
                  ? '...'
                  : formatAmount(
                      convertedTotalProcessed ?? data?.totalProcessedAmount ?? 0,
                      selectedCurrency.code || data?.primaryCurrency || 'N/A'
                    )}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-wide text-slate-500">Average Transaction</p>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {isLoading
                  ? '...'
                  : formatAmount(
                      convertedAverage ?? data?.averageTransactionAmount ?? 0,
                      selectedCurrency.code || data?.primaryCurrency || 'N/A'
                    )}
              </p>
            </div>
          </div>

          {isFxLoading && baseCurrency && baseCurrency !== selectedCurrency.code && (
            <p className="text-xs text-slate-500 mt-4">Updating conversion rate...</p>
          )}
          {!isFxLoading && effectiveRate && baseCurrency && (
            <p className="text-xs text-slate-500 mt-4">
              FX rate: 1 {baseCurrency} = {effectiveRate.toFixed(6)} {selectedCurrency.code}
            </p>
          )}
          {data?.currenciesUsed && data.currenciesUsed.length > 1 && (
            <p className="text-xs text-slate-500 mt-4">
              Multiple source currencies detected ({data.currenciesUsed.join(', ')}). Display conversion uses primary currency {data.primaryCurrency}.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Latest Trend</h2>
          <p className="text-sm text-slate-600 mt-1">Compared to the previous day.</p>

          <div className="mt-6 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${trendSummary.direction === 'up' ? 'bg-emerald-100' : trendSummary.direction === 'down' ? 'bg-red-100' : 'bg-slate-100'}`}>
              <TrendingUp
                size={20}
                className={trendSummary.direction === 'up' ? 'text-emerald-700' : trendSummary.direction === 'down' ? 'text-red-700 rotate-180' : 'text-slate-500'}
              />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{trendSummary.latest} txns</p>
              <p className="text-xs text-slate-600">Previous day: {trendSummary.previous} txns</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-6" onClick={() => refetch()}>
            Refresh
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Provider Performance</h2>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading provider analytics...</p>
        ) : !data?.providers?.length ? (
          <p className="text-sm text-slate-600">No provider activity in selected period.</p>
        ) : (
          <div className="space-y-3">
            {data.providers.map((provider) => (
              <div key={provider.providerCode} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{provider.providerName}</p>
                    <p className="text-xs text-slate-600">Code: {provider.providerCode}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Transactions</p>
                      <p className="font-semibold text-slate-900">{provider.transactions}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Success Rate</p>
                      <p className="font-semibold text-emerald-700">{provider.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Successful</p>
                      <p className="font-semibold text-slate-900">{provider.successfulTransactions}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Processed Amount</p>
                      <p className="font-semibold text-slate-900">
                        {formatAmount(
                          typeof effectiveRate === 'number' ? provider.processedAmount * effectiveRate : provider.processedAmount,
                          selectedCurrency.code || data.primaryCurrency || 'N/A'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalyticsTab;
