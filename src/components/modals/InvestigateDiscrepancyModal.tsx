// src/components/modals/InvestigateDiscrepancyModal.tsx
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface Discrepancy {
  id: string;
  type: string;
  payment: string;
  provider: string;
  paybridgeAmount: string;
  providerAmount: string;
  difference: string;
}

interface InvestigateDiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  discrepancy: Discrepancy | null;
}

export const InvestigateDiscrepancyModal: React.FC<InvestigateDiscrepancyModalProps> = ({
  isOpen,
  onClose,
  discrepancy
}) => {
  if (!discrepancy) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Investigate Discrepancy" size="lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
          <AlertTriangle className="text-amber-600" size={20} />
          <div>
            <h4 className="font-semibold text-amber-900">{discrepancy.type.replace('_', ' ')}</h4>
            <p className="text-sm text-amber-700">Payment ID: {discrepancy.payment}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-medium text-slate-900">PayBridge Record</h5>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Amount</p>
              <p className="font-semibold text-slate-900">{discrepancy.paybridgeAmount}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-medium text-slate-900">{discrepancy.provider} Record</h5>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Amount</p>
              <p className="font-semibold text-slate-900">{discrepancy.providerAmount}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-xl">
          <p className="text-sm font-medium text-red-900">Difference: {discrepancy.difference}</p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <Button variant="outline" icon={ExternalLink}>
            View in {discrepancy.provider}
          </Button>
          <Button variant="primary">
            Mark as Resolved
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};