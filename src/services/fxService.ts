export interface FxRateResult {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  fetchedAt: string;
}

interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  'error-type'?: string;
  base_code?: string;
  conversion_rates?: Record<string, number>;
  time_last_update_utc?: string;
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const rateCache = new Map<string, { rate: number; fetchedAt: string; cachedAt: number }>();

const getFxApiKey = (): string => {
  const env = import.meta.env as Record<string, string | boolean | undefined>;
  const key = env.VITE_FX_API_KEY || env.FX_API_KEY;

  if (!key || typeof key !== 'string' || !key.trim()) {
    throw new Error('FX API key is missing. Set VITE_FX_API_KEY in your frontend .env file.');
  }

  return key.trim();
};

class FxService {
  async getConversionRate(baseCurrency: string, targetCurrency: string): Promise<FxRateResult> {
    const base = baseCurrency.trim().toUpperCase();
    const target = targetCurrency.trim().toUpperCase();

    if (!base || !target) {
      throw new Error('Base and target currencies are required.');
    }

    if (base === target) {
      return {
        baseCurrency: base,
        targetCurrency: target,
        rate: 1,
        fetchedAt: new Date().toISOString(),
      };
    }

    const cacheKey = `${base}_${target}`;
    const cached = rateCache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return {
        baseCurrency: base,
        targetCurrency: target,
        rate: cached.rate,
        fetchedAt: cached.fetchedAt,
      };
    }

    const apiKey = getFxApiKey();
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);

    if (!response.ok) {
      throw new Error(`Unable to fetch FX rates (${response.status}).`);
    }

    const payload = (await response.json()) as ExchangeRateApiResponse;

    if (payload.result !== 'success' || !payload.conversion_rates) {
      const apiError = payload['error-type'] ? ` (${payload['error-type']})` : '';
      throw new Error(`ExchangeRate-API returned an error${apiError}.`);
    }

    const rate = payload.conversion_rates[target];
    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      throw new Error(`Currency ${target} is not available in FX response.`);
    }

    const fetchedAt = payload.time_last_update_utc || new Date().toISOString();
    rateCache.set(cacheKey, { rate, fetchedAt, cachedAt: Date.now() });

    return {
      baseCurrency: base,
      targetCurrency: target,
      rate,
      fetchedAt,
    };
  }
}

export const fxService = new FxService();
