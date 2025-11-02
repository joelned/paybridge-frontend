import React, { useState } from 'react';
import { Plus, Search, Copy, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useModalContext } from '../../../contexts/ModalContext';
import { useToast } from '../../../contexts/ToastContext';

export const PaymentLinksTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentLinks] = useState([
    {
      id: 'link_1234',
      title: 'Product Purchase',
      amount: '$99.99',
      status: 'ACTIVE',
      clicks: 45,
      conversions: 12,
      created: '2024-10-13',
      url: 'https://pay.example.com/link_1234'
    },
    {
      id: 'link_1235',
      title: 'Service Payment',
      amount: '$249.00',
      status: 'ACTIVE',
      clicks: 23,
      conversions: 8,
      created: '2024-10-12',
      url: 'https://pay.example.com/link_1235'
    },
    {
      id: 'link_1236',
      title: 'Subscription Fee',
      amount: '$29.99',
      status: 'EXPIRED',
      clicks: 156,
      conversions: 89,
      created: '2024-10-10',
      url: 'https://pay.example.com/link_1236'
    }
  ]);

  const statusColors = {
    ACTIVE: 'success',
    EXPIRED: 'default',
    DISABLED: 'danger'
  };

  const filteredLinks = paymentLinks.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
          <p className="text-gray-600">Create and manage payment links for easy collection</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => openModal('createLink')}>
          Create Link
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search payment links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.id}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={statusColors[link.status] as any}>
                    {link.status}
                  </Badge>
                  <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">{link.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Clicks</span>
                  <span className="font-medium">{link.clicks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversions</span>
                  <span className="font-medium text-green-600">{link.conversions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{link.created}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={Copy}
                  onClick={() => {
                    navigator.clipboard.writeText(link.url);
                    showToast('Link copied to clipboard!', 'success');
                  }}
                  className="flex-1"
                >
                  Copy Link
                </Button>
                <Button variant="ghost" size="sm" icon={Eye}>
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment links found</p>
            <Button variant="primary" icon={Plus} className="mt-4" onClick={() => openModal('createLink')}>
              Create Your First Link
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentLinksTab;