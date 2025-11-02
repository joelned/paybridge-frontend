import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { usePayments } from '../../hooks/queries/usePayments';
import { formatCurrency } from '../../utils/currencyFormatter';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface PaymentRowProps {
  index: number;
  style: React.CSSProperties;
  data: any[];
}

const PaymentRow = React.memo(({ index, style, data }: PaymentRowProps) => {
  const payment = data[index];
  
  return (
    <div style={style} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {payment.reference}
            </p>
            <p className="text-sm text-gray-500">
              {payment.customer?.email || 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(payment.amount, payment.currency)}
            </p>
            <p className={`text-xs px-2 py-1 rounded-full ${
              payment.status === 'completed' 
                ? 'bg-green-100 text-green-800'
                : payment.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {payment.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentRow.displayName = 'PaymentRow';

export const VirtualizedPaymentsTab = React.memo(() => {
  const { data: payments = [], isLoading, error } = usePayments();

  const getItemKey = useCallback((index: number) => 
    payments[index]?.id || `payment-${index}`, 
    [payments]
  );

  const virtualizedProps = useMemo(() => ({
    height: 600,
    itemCount: payments.length,
    itemSize: 80,
    itemData: payments,
    overscanCount: 10,
  }), [payments]);

  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load payments</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No payments found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Payments ({payments.length})
        </h3>
      </div>
      <List
        {...virtualizedProps}
        itemKey={getItemKey}
      >
        {PaymentRow}
      </List>
    </div>
  );
});

VirtualizedPaymentsTab.displayName = 'VirtualizedPaymentsTab';