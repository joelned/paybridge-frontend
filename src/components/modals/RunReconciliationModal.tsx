// src/components/modals/RunReconciliationModal.tsx
import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { FormModal } from './FormModal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface RunReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReconciliationRequest) => void;
  loading?: boolean;
}

interface ReconciliationRequest {
  provider: string;
  startDate: string;
  endDate: string;
  includeRefunds: boolean;
}

export const RunReconciliationModal: React.FC<RunReconciliationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<ReconciliationRequest>({
    provider: 'all',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeRefunds: true
  });

  const providers = [
    { value: 'all', label: 'All Providers' },
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
      title="Run Reconciliation"
      submitText="Start Reconciliation"
      loading={loading}
      size="md"
    >
      <div className="space-y-5">
        <Select
          label="Payment Provider"
          value={formData.provider}
          onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
          options={providers}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            icon={Calendar}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            icon={Calendar}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="includeRefunds"
            checked={formData.includeRefunds}
            onChange={(e) => setFormData(prev => ({ ...prev, includeRefunds: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="includeRefunds" className="text-sm font-medium text-slate-700">
            Include refunded transactions
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Reconciliation Process</p>
              <p className="text-xs text-blue-700 mt-1">
                This will compare PayBridge transactions with provider records to identify discrepancies. 
                Large date ranges may take several minutes to process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};