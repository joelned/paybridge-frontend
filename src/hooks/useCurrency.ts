import { useState, useEffect } from 'react';
import { Currency } from '../utils/currencyFormatter';

export function useCurrency(defaultCurrency: string = 'USD') {
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  useEffect(() => {
    // Load saved currency preference
    const saved = localStorage.getItem('paybridge-default-currency');
    if (saved) {
      setCurrency(saved);
    }
  }, []);

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('paybridge-default-currency', newCurrency);
  };

  return {
    currency,
    setCurrency: updateCurrency
  };
}