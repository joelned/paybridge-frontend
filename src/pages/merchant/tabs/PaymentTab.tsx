import React, { useState } from 'react';
import { Plus, Search, Download, Eye, X, Shield } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import type { Payment } from '../../../types';

export const PaymentsTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const payments: Payment[] = [
    { id: 'pay_1234', customer: 'john@example.com', amount: '$249.00', status: 'SUCCEEDED', provider: 'Stripe', date: '2024-10-13 14:23', idempotencyKey: 'idem_abc123' },
    { id: 'pay_1235', customer: 'jane@example.com', amount: '$89.99', status: 'SUCCEEDED', provider: 'PayPal', date: '2024-10-13 14:10', idempotencyKey: 'idem_def456' },
    { id: 'pay_1236', customer: 'bob@example.com', amount: '$1,299.00', status: 'PROCESSING', provider: 'Flutterwave', date: '2024-10-13 13:45', idempotencyKey: 'idem_ghi789' },
    { id: 'pay_1237', customer: 'alice@example.com', amount: '$449.50', status: 'FAILED', provider: 'Stripe', date: '2024-10-12 16:30', idempotencyKey: 'idem_jkl012' }
  ];

  const statusColors = {
    SUCCEEDED: 'success',
    PROCESSING: 'warning',
    FAILED: 'danger',
    PENDING: 'info',
    REFUNDED: 'default'
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Payments</h2>
          <p className="text-sm text-gray-600 mt-1">Unified view across all providers</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>Create Payment</Button>
      </div>

      <Card className="p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <Button variant="outline" icon={Download}>Export CSV</Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.customer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusColors[payment.status] as any}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.provider}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create Payment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Customer Email" placeholder="customer@example.com" required value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                              throw new Error('Function not implemented.');
                          } } />
              <Input label="Amount" type="number" placeholder="100.00" required value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                              throw new Error('Function not implemented.');
                          } } />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>NGN</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider (Optional)</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value="">Auto-route (Recommended)</option>
                  <option>Stripe</option>
                  <option>PayPal</option>
                  <option>Flutterwave</option>
                </select>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-indigo-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Idempotency Protection</p>
                    <p className="text-xs text-indigo-700 mt-1">A unique idempotency key will be automatically generated to prevent duplicate charges</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Create Payment</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};