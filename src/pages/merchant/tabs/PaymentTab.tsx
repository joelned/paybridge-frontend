import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Eye, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/section/SectionHeader';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useModalContext } from '../../../contexts/ModalContext';
import { DebouncedSearchInput } from '../../../components/common/DebouncedSearchInput';
import { useSearchState } from '../../../hooks/useSearchState';
import { usePayments } from '../../../hooks/queries';
import type { Payment } from '../../../types';

export const PaymentsTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { debouncedQuery, handleSearch, isSearching } = useSearchState({ delay: 300 });
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { data: paymentsData, isLoading, error } = usePayments({
    search: debouncedQuery,
    status: filterStatus === 'all' ? undefined : filterStatus
  });
  
  const payments = paymentsData?.payments || [];

  const statusColors = {
    SUCCEEDED: 'success',
    PROCESSING: 'warning',
    FAILED: 'danger',
    PENDING: 'info',
    REFUNDED: 'default'
  };

  const filteredPayments = payments;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="All Payments"
        subtitle="Unified view across all providers"
      />

      <Card padding="lg">
        <Toolbar>
          <DebouncedSearchInput
            placeholder="Search by customer or ID..."
            onSearch={handleSearch}
            delay={300}
            className="flex-1 max-w-md"
            isLoading={isSearching}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <Button variant="outline" icon={Download} onClick={() => openModal('exportData', { type: 'payments' })}>Export CSV</Button>
        </Toolbar>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading payments...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading payments</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-25 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-25 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[payment.status] as any}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{payment.provider}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Eye}
                          onClick={() => openModal('transactionDetails', { transaction: payment })}
                        >
                          View
                        </Button>
                        {payment.status === 'FAILED' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={RefreshCw}
                            onClick={() => openModal('retryPayment', { payment })}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>


    </div>
  );
};

export default PaymentsTab;