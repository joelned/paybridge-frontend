import React, { useState } from 'react';
import { Plus, Link2, Copy, ExternalLink, Settings, X } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/section/SectionHeader';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import type { PaymentLink } from '../../../types';

export const PaymentLinksTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const paymentLinks: PaymentLink[] = [
    { id: 'link_1', name: 'Product Purchase', amount: '$99.00', url: 'paybridge.co/pay/abc123', clicks: 145, conversions: 89, status: 'active' },
    { id: 'link_2', name: 'Subscription', amount: '$29.99/mo', url: 'paybridge.co/pay/def456', clicks: 234, conversions: 156, status: 'active' },
    { id: 'link_3', name: 'Donation', amount: 'Custom', url: 'paybridge.co/pay/ghi789', clicks: 567, conversions: 234, status: 'active' },
    { id: 'link_4', name: 'Event Ticket', amount: '$150.00', url: 'paybridge.co/pay/jkl012', clicks: 89, conversions: 45, status: 'expired' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Payment Links"
        subtitle="Create shareable payment links with hosted checkout pages"
        actions={<Button icon={Plus} onClick={() => setShowCreateModal(true)}>Create Link</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {paymentLinks.map((link) => (
          <Card key={link.id} padding="lg" interactive className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                  <Badge variant={link.status === 'active' ? 'success' : 'default'}>
                    {link.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                  <Link2 size={16} />
                  <span className="font-mono break-all sm:break-normal sm:truncate sm:max-w-[240px]" title={link.url}>{link.url}</span>
                  <button className="text-indigo-600 hover:text-indigo-700" aria-label="Copy link">
                    <Copy size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Amount</span>
                    <div className="font-semibold text-gray-900">{link.amount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Clicks</span>
                    <div className="font-semibold text-gray-900">{link.clicks}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Conversions</span>
                    <div className="font-semibold text-green-600">{link.conversions}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Rate</span>
                    <div className="font-semibold text-gray-900">{((link.conversions / link.clicks) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" icon={ExternalLink}>Open</Button>
                <Button variant="outline" size="sm" icon={Settings}>Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
          <Card padding="lg" className="w-full max-w-2xl max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create Payment Link</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
        <Input label="Link Name" placeholder="Product Purchase" required value={''} onChange={() => {}} />
        <Input label="Amount" type="number" placeholder="99.00" required value={''} onChange={() => {}} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>NGN</option>
                </select>
              </div>
        <Input label="Description" placeholder="What is this payment for?" value={''} onChange={() => {}} />
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Create Link</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};