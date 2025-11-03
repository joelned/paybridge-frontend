import React from 'react';
import { formatAmount, parseCurrency, getSupportedCurrencies } from '../../utils/currency';
interface Props {
  label?: string;
  amount: number;
  currency: string;
  onAmountChange: (amount: number) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  supportedCurrencies?: string[];
}

export const MoneyInput: React.FC<Props> = ({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  placeholder = '0.00',
  error,
  required = false,
  supportedCurrencies
}) => {
  const currencies = getSupportedCurrencies();
  const availableCurrencies = supportedCurrencies 
    ? currencies.filter(c => supportedCurrencies.includes(c.code))
    : currencies;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseCurrency(value);
    onAmountChange(parsed);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className={`px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {availableCurrencies.map(curr => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          value={formatAmount(amount, currency, false)}
          onChange={handleAmountChange}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border-t border-r border-b rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};