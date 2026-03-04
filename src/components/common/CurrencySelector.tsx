import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: Currency) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          w-full bg-white border border-slate-200 rounded-lg
          flex items-center justify-between gap-2
          hover:border-slate-300 hover:bg-slate-50
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
        `}
        aria-label={`Select currency, currently ${selectedCurrency.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none">{selectedCurrency.flag}</span>
          <span className="font-semibold text-slate-900">{selectedCurrency.symbol}</span>
          <span className="font-medium text-slate-700">{selectedCurrency.code}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="py-1" role="listbox" aria-label="Currency options">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => handleSelect(currency)}
                className={`
                  w-full px-3 py-2 text-left flex items-center justify-between gap-2
                  hover:bg-slate-50 focus:bg-slate-50 focus:outline-none
                  transition-colors duration-150
                  ${currency.code === selectedCurrency.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                `}
                role="option"
                aria-selected={currency.code === selectedCurrency.code}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg leading-none">{currency.flag}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{currency.symbol}</span>
                    <span className="font-medium">{currency.code}</span>
                  </div>
                  <span className="text-slate-500 truncate">{currency.name}</span>
                </div>
                {currency.code === selectedCurrency.code && (
                  <Check size={16} className="text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};