// src/components/modals/TransactionDetailsModal.tsx
import React, { useState } from 'react';
import { Copy, ExternalLink, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';
import { ConfirmModal } from './ConfirmModal';

interface Transaction {
  id: string;
  amount: string;
  status: 'SUCCEEDED' | 'PROCESSING' | 'FAILED' | 'PENDING' | 'REFUNDED';
  customer: string;
  provider: string;
  date: string;
  idempotencyKey: string;
  fees?: string;
  netAmount?: string;
  refundable?: boolean;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refunding, setRefunding] = useState(false);

  if (!transaction) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return <CheckCircle className="text-emerald-600" size={20} />;
      case 'FAILED': return <AlertCircle className="text-red-600" size={20} />;
      case 'PROCESSING': case 'PENDING': return <Clock className="text-amber-600" size={20} />;
      default: return <RefreshCw className="text-blue-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return 'bg-emerald-100 text-emerald-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PROCESSING': case 'PENDING': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefund = async () => {
    setRefunding(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefunding(false);
    setShowRefundModal(false);
    onClose();
  };

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="lg">
        <div className="p-6 space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              {getStatusIcon(transaction.status)}
              <div>
                <h3 className="font-semibold text-slate-900">{transaction.amount}</h3>
                <p className="text-sm text-slate-600">Transaction ID: {transaction.id}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Customer</label>
                <p className="text-slate-900 mt-1">{transaction.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Payment Provider</label>
                <p className="text-slate-900 mt-1">{transaction.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Date & Time</label>
                <p className="text-slate-900 mt-1">{transaction.date}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Gross Amount</label>
                <p className="text-slate-900 mt-1">{transaction.amount}</p>
              </div>
              {transaction.fees && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Processing Fees</label>
                  <p className="text-slate-900 mt-1">-{transaction.fees}</p>
                </div>
              )}
              {transaction.netAmount && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Net Amount</label>
                  <p className="text-slate-900 mt-1 font-semibold">{transaction.netAmount}</p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="font-medium text-slate-900 mb-4">Technical Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Idempotency Key</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-slate-900">{transaction.idempotencyKey}</code>
                  <button
                    onClick={() => copyToClipboard(transaction.idempotencyKey)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <Button variant="ghost" icon={ExternalLink}>
              View in Provider Dashboard
            </Button>
            {transaction.status === 'FAILED' && (
              <Button variant="outline" icon={RefreshCw}>
                Retry Payment
              </Button>
            )}
            {transaction.refundable && transaction.status === 'SUCCEEDED' && (
              <Button 
                variant="outline" 
                onClick={() => setShowRefundModal(true)}
              >
                Process Refund
              </Button>
            )}
          </div>
        </div>
      </BaseModal>

      <ConfirmModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleRefund}
        title="Process Refund"
        message={`Are you sure you want to refund ${transaction.amount} to ${transaction.customer}? This action cannot be undone.`}
        confirmText="Process Refund"
        variant="warning"
        loading={refunding}
      />
    </>
  );
};