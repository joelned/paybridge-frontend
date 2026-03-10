import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Currency } from '../components/common/CurrencySelector';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  flag: '🇺🇸'
};

// Available currencies list
const AVAILABLE_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('paybridge-currency');
    if (saved) {
      try {
        const parsedCurrency = JSON.parse(saved);
        // Validate that the saved currency exists in our list
        const validCurrency = AVAILABLE_CURRENCIES.find(c => c.code === parsedCurrency.code);
        return validCurrency || DEFAULT_CURRENCY;
      } catch {
        return DEFAULT_CURRENCY;
      }
    }
    return DEFAULT_CURRENCY;
  });

  useEffect(() => {
    localStorage.setItem('paybridge-currency', JSON.stringify(selectedCurrency));
  }, [selectedCurrency]);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  const formatAmount = (amount: number): string => {
    // For currencies not supported by Intl.NumberFormat, use custom formatting
    const unsupportedCurrencies = ['NGN'];
    
    if (unsupportedCurrencies.includes(selectedCurrency.code)) {
      const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `${selectedCurrency.symbol}${formattedNumber}`;
    }
    
    // Use standard Intl.NumberFormat for supported currencies
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedCurrency.code,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback for any unsupported currency
      const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `${selectedCurrency.symbol}${formattedNumber}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
