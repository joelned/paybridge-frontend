// src/components/modals/RetryPaymentModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { FormModal } from './FormModal';
import { Select } from '../common/Select';

interface Payment {
  id: string;
  customer: string;
  amount: string;
  status: string;
  provider: string;
  date: string;
  idempotencyKey: string;
}

interface RetryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RetryPaymentData) => void;
  payment: Payment | null;
  loading?: boolean;
}

interface RetryPaymentData {
  provider: string;
  useNewIdempotencyKey: boolean;
}

export const RetryPaymentModal: React.FC<RetryPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  payment,
  loading = false
}) => {
  const [formData, setFormData] = useState<RetryPaymentData>({
    provider: 'auto',
    useNewIdempotencyKey: true
  });

  if (!payment) return null;

  const providers = [
    { value: 'auto', label: 'Auto-route (Recommended)' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'flutterwave', label: 'Flutterwave' },
    { value: 'paystack', label: 'Paystack' }
  ];

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Retry Payment"
      submitText="Retry Payment"
      loading={loading}
      size="md"
    >
      <div className="space-y-5">
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="text-slate-600" size={20} />
            <div>
              <h4 className="font-semibold text-slate-900">{payment.amount}</h4>
              <p className="text-sm text-slate-600">{payment.customer}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <p>Payment ID: {payment.id}</p>
            <p>Original Provider: {payment.provider}</p>
            <p>Failed: {payment.date}</p>
          </div>
        </div>

        <Select
          label="Payment Provider"
          value={formData.provider}
          onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
          options={providers}
          required
          hint="Choose a different provider or let PayBridge auto-route"
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="useNewIdempotencyKey"
            checked={formData.useNewIdempotencyKey}
            onChange={(e) => setFormData(prev => ({ ...prev, useNewIdempotencyKey: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="useNewIdempotencyKey" className="text-sm font-medium text-slate-700">
            Generate new idempotency key (recommended)
          </label>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-amber-900">Retry Considerations</p>
              <ul className="text-xs text-amber-700 mt-1 space-y-1">
                <li>• The customer will not be charged twice for the same payment</li>
                <li>• A new payment attempt will be created with updated routing</li>
                <li>• You'll receive webhook notifications for the retry attempt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};