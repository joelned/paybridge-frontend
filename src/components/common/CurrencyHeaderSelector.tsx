import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Currency } from './CurrencySelector';

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
];

interface CurrencyHeaderSelectorProps {
  value: string;
  onChange: (currency: Currency) => void;
  className?: string;
}

export const CurrencyHeaderSelector: React.FC<CurrencyHeaderSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

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
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-slate-100 hover:bg-slate-200 
          border border-transparent hover:border-slate-300
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-200
          ${isOpen ? 'bg-slate-200 border-slate-300' : ''}
        `}
        aria-label={`Currency selector: ${selectedCurrency.name}`}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-slate-600">{selectedCurrency.symbol}</span>
        <span className="text-sm font-medium text-slate-700">{selectedCurrency.code}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide border-b border-slate-100">
              Display Currency
            </div>
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => handleSelect(currency)}
                className={`
                  w-full px-3 py-2 text-left flex items-center justify-between
                  hover:bg-slate-50 focus:bg-slate-50 focus:outline-none
                  transition-colors duration-150
                  ${currency.code === selectedCurrency.code ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{currency.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{currency.symbol}</span>
                      <span className="font-medium text-slate-700">{currency.code}</span>
                    </div>
                    <div className="text-xs text-slate-500">{currency.name}</div>
                  </div>
                </div>
                {currency.code === selectedCurrency.code && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
