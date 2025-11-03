import React from 'react';
import { Button } from '../components/common/Button';
import { useModalContext } from '../contexts/ModalContext';

export const ModalTest: React.FC = () => {
  const { openModal } = useModalContext();

  const testModals = [
    { id: 'addProvider', label: 'Add Provider' },
    { id: 'updateProvider', label: 'Update Provider' },
    { id: 'viewProviderDashboard', label: 'View Provider Dashboard' },
    { id: 'retryPayment', label: 'Retry Payment' },
    { id: 'transactionDetails', label: 'Transaction Details' },
    { id: 'exportData', label: 'Export Data' },
    { id: 'runReconciliation', label: 'Run Reconciliation' },
    { id: 'investigateDiscrepancy', label: 'Investigate Discrepancy' },
    { id: 'updateBusinessInfo', label: 'Update Business Info' },
    { id: 'createPaymentLink', label: 'Create Payment Link' },
    { id: 'confirmDialog', label: 'Confirm Dialog' },
    { id: 'success', label: 'Success Modal' },
    { id: 'info', label: 'Info Modal' },
    { id: 'loading', label: 'Loading Modal' }
  ] as const;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Modal System Test</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {testModals.map(({ id, label }) => (
          <Button
            key={id}
            variant="outline"
            onClick={() => openModal(id as any, { test: true })}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};