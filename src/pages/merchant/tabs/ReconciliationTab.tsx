import React, { useState } from 'react';
import { RefreshCw, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';

type ReconciliationStatus = 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
type DiscrepancyType = 'AMOUNT_MISMATCH' | 'MISSING_PAYMENT' | 'STATUS_MISMATCH' | 'EXTRA_PAYMENT';

interface ReconciliationJob {
  id: string;
  provider: string;
  period: string;
  status: ReconciliationStatus;
  matched: number;
  discrepancies: number;
  date: string;
}

interface Discrepancy {
  id: string;
  type: DiscrepancyType;
  payment: string;
  provider: string;
  paybridgeAmount: string;
  providerAmount: string;
  difference: string;
}

export const ReconciliationTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'jobs' | 'discrepancies'>('jobs');

  const reconciliationJobs: ReconciliationJob[] = [
    { id: 'job_1', provider: 'Stripe', period: 'Oct 1-7, 2024', status: 'COMPLETED', matched: 543, discrepancies: 2, date: '2024-10-08' },
    { id: 'job_2', provider: 'PayPal', period: 'Oct 1-7, 2024', status: 'COMPLETED', matched: 412, discrepancies: 5, date: '2024-10-08' },
    { id: 'job_3', provider: 'Flutterwave', period: 'Oct 1-7, 2024', status: 'IN_PROGRESS', matched: 285, discrepancies: 0, date: '2024-10-08' },
    { id: 'job_4', provider: 'All Providers', period: 'Sep 2024', status: 'COMPLETED', matched: 4521, discrepancies: 18, date: '2024-10-01' }
  ];

  const discrepancies: Discrepancy[] = [
    { id: 'disc_1', type: 'AMOUNT_MISMATCH', payment: 'pay_1234', provider: 'Stripe', paybridgeAmount: '$100.00', providerAmount: '$99.50', difference: '$0.50' },
    { id: 'disc_2', type: 'MISSING_PAYMENT', payment: 'pay_5678', provider: 'PayPal', paybridgeAmount: '$250.00', providerAmount: '-', difference: '$250.00' },
    { id: 'disc_3', type: 'STATUS_MISMATCH', payment: 'pay_9012', provider: 'Flutterwave', paybridgeAmount: '$75.00', providerAmount: '$75.00', difference: 'Status' }
  ];

  const statusColors: Record<ReconciliationStatus, 'success' | 'warning' | 'danger' | 'info'> = {
    COMPLETED: 'success',
    IN_PROGRESS: 'warning',
    FAILED: 'danger',
    PENDING: 'info'
  };

  const discrepancyColors: Record<DiscrepancyType, 'warning' | 'danger' | 'info' | 'purple'> = {
    AMOUNT_MISMATCH: 'warning',
    MISSING_PAYMENT: 'danger',
    STATUS_MISMATCH: 'info',
    EXTRA_PAYMENT: 'purple'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reconciliation</h2>
          <p className="text-sm text-gray-600 mt-1">Automatic transaction matching and discrepancy detection</p>
        </div>
        <Button icon={RefreshCw}>Run Reconciliation</Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveView('jobs')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'jobs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Reconciliation Jobs
        </button>
        <button
          onClick={() => setActiveView('discrepancies')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'discrepancies'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Discrepancies
        </button>
      </div>

      {activeView === 'jobs' && (
        <div className="space-y-4">
          {reconciliationJobs.map((job) => (
            <Card key={job.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{job.provider} Reconciliation</h3>
                    <Badge variant={statusColors[job.status]}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Period: {job.period}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-600">Matched: </span>
                      <span className="font-semibold text-gray-900">{job.matched}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="text-red-600" size={16} />
                      <span className="text-gray-600">Discrepancies: </span>
                      <span className="font-semibold text-red-600">{job.discrepancies}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-400" size={16} />
                      <span className="text-gray-600">{job.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Report</Button>
                  <Button variant="outline" size="sm" icon={Download}>Export</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeView === 'discrepancies' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PayBridge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {discrepancies.map((disc) => (
                  <tr key={disc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <Badge variant={discrepancyColors[disc.type]}>
                        {disc.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm font-mono text-gray-900">{disc.payment}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{disc.provider}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{disc.paybridgeAmount}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{disc.providerAmount}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-red-600">{disc.difference}</td>
                    <td className="px-6 py-3">
                      <Button variant="outline" size="sm">Investigate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};