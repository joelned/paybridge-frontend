import React, { useState } from 'react';
import { Plus, Link2, Copy, ExternalLink, Settings, X, TrendingUp, MousePointer, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { SectionHeader } from '../../../components/section/SectionHeader';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useToast } from '../../../contexts/ToastContext';
import type { PaymentLink } from '../../../types';

export const PaymentLinksTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '', currency: 'USD', description: '' });
  const { success } = useToast();

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
        actions={
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Link
          </Button>
        }
      />

      {/* Empty State */}
      {paymentLinks.length === 0 ? (
        <Card padding="lg" className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment links yet</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Create your first payment link to start accepting payments with a simple, shareable URL.
            </p>
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
              Create Your First Link
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {paymentLinks.map((link) => (
            <Card key={link.id} padding="lg" className="border border-gray-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">{link.name}</h3>
                    <Badge variant={link.status === 'active' ? 'success' : 'default'}>
                      {link.status}
                    </Badge>
                  </div>
                  
                  {/* URL Section */}
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <Link2 size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="font-mono text-xs text-gray-700 truncate flex-1" title={link.url}>
                      {link.url}
                    </span>
                    <button 
                      className="p-1 text-gray-400 rounded flex-shrink-0" 
                      aria-label="Copy link"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://${link.url}`);
                        success('Link Copied', 'Payment link copied to clipboard');
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Display */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-1">Amount</div>
                <div className="text-xl font-bold text-gray-900">{link.amount}</div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Clicks</div>
                  <div className="text-sm font-semibold text-gray-900">{link.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Sales</div>
                  <div className="text-sm font-semibold text-emerald-600">{link.conversions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Rate</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {((link.conversions / link.clicks) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={ExternalLink} className="flex-1">
                  Open
                </Button>
                <Button variant="ghost" size="sm" icon={Settings} className="px-3">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
              onClick={() => setShowCreateModal(false)}
            />
            <Card padding="none" className="relative w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create Payment Link</h3>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="p-1 text-gray-400 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setCreating(true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                success('Payment Link Created', `Link "${formData.name}" has been created successfully`);
                setFormData({ name: '', amount: '', currency: 'USD', description: '' });
                setCreating(false);
                setShowCreateModal(false);
              }} className="space-y-4">
                
                <Input 
                  label="Link Name" 
                  placeholder="Product Purchase" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    label="Amount" 
                    type="number" 
                    placeholder="99.00" 
                    required 
                    value={formData.amount} 
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select 
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="What is this payment for? (Optional)"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" loading={creating}>
                    Create Link
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateModal(false)} 
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};