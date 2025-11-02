export const Currency = {
  USD: 'USD',
  NGN: 'NGN',
  GHS: 'GHS',
  KES: 'KES',
  ZAR: 'ZAR',
  EUR: 'EUR',
  GBP: 'GBP'
} as const;

export type Currency = typeof Currency[keyof typeof Currency];

interface CurrencyConfig {
  symbol: string;
  decimals: number;
  locale: string;
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', decimals: 2, locale: 'en-US' },
  NGN: { symbol: '₦', decimals: 2, locale: 'en-NG' },
  GHS: { symbol: '₵', decimals: 2, locale: 'en-GH' },
  KES: { symbol: 'KSh', decimals: 2, locale: 'en-KE' },
  ZAR: { symbol: 'R', decimals: 2, locale: 'en-ZA' },
  EUR: { symbol: '€', decimals: 2, locale: 'en-EU' },
  GBP: { symbol: '£', decimals: 2, locale: 'en-GB' }
};

export function formatCurrency(amount: number | string, currencyCode: string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.USD;
  
  if (isNaN(numAmount)) return `${config.symbol}0.00`;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(numAmount);
  } catch {
    // Fallback formatting
    return `${config.symbol}${numAmount.toFixed(config.decimals)}`;
  }
}

export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_CONFIGS[currencyCode]?.symbol || '$';
}

export function parseCurrency(formatted: string): number {
  // Remove currency symbols and spaces, keep numbers and decimal point
  const cleaned = formatted.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function getCurrencyDecimals(currencyCode: string): number {
  return CURRENCY_CONFIGS[currencyCode]?.decimals || 2;
}

export function getSupportedCurrencies(): Array<{ code: string; name: string; symbol: string }> {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];
}

export function formatAmount(amount: number | string, currencyCode: string, showSymbol = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.USD;
  
  if (isNaN(numAmount)) return showSymbol ? `${config.symbol}0.00` : '0.00';
  
  const formatted = numAmount.toFixed(config.decimals);
  return showSymbol ? `${config.symbol}${formatted}` : formatted;
}