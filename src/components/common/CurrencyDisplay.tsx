import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

interface Props {
  amount: number | string;
  currency: string;
  className?: string;
  showCode?: boolean;
}

export const CurrencyDisplay: React.FC<Props> = ({ 
  amount, 
  currency, 
  className = '',
  showCode = false 
}) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  const formatted = formatCurrency(numericAmount, currency);
  
  return (
    <span className={className}>
      {formatted}
      {showCode && ` ${currency}`}
    </span>
  );
};