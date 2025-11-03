export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

const SUPPORTED_CURRENCIES: Currency[] = [
  // International
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  
  // African
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 2 },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', decimals: 2 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', decimals: 2 },
  
  // Additional
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
];

export function getSupportedCurrencies(): Currency[] {
  return SUPPORTED_CURRENCIES;
}

export function getCurrency(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.code === code);
}

export function formatAmount(amount: number, currency: string, includeSymbol: boolean = true): string {
  const currencyInfo = getCurrency(currency);
  const decimals = currencyInfo?.decimals ?? 2;
  
  const formatted = amount.toFixed(decimals);
  
  if (!includeSymbol) {
    return formatted;
  }
  
  const symbol = currencyInfo?.symbol ?? currency;
  return `${symbol}${formatted}`;
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCurrency(amount: number, currency: string): string {
  return formatAmount(amount, currency, true);
}