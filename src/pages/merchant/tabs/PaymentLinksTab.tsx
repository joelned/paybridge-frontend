import React, { useMemo } from 'react';
import { Plus, Search, Copy, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useModalContext } from '../../../contexts/ModalContext';
import { useToast } from '../../../contexts/ToastContext';
import { DebouncedSearchInput } from '../../../components/common/DebouncedSearchInput';
import { useSearchState } from '../../../hooks/useSearchState';
import { usePaymentLinks } from '../../../hooks/queries';

export const PaymentLinksTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { showToast } = useToast();
  const { debouncedQuery, handleSearch, isSearching } = useSearchState({ delay: 300 });
  const { data: paymentLinksData, isLoading, error } = usePaymentLinks();
  
  const paymentLinks = paymentLinksData?.paymentLinks || [];

  const statusColors = {
    ACTIVE: 'success',
    EXPIRED: 'default',
    INACTIVE: 'danger'
  };

  const filteredLinks = useMemo(() => {
    return paymentLinks.filter(link =>
      link.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      link.id.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [paymentLinks, debouncedQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
          <p className="text-gray-600">Create and manage payment links for easy collection</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => openModal('createPaymentLink')}>
          Create Link
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <DebouncedSearchInput
            placeholder="Search payment links..."
            onSearch={handleSearch}
            delay={300}
            className="flex-1 max-w-md"
            isLoading={isSearching}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading payment links...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading payment links</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : (
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
                  <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">{link.amount} {link.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uses</span>
                  <span className="font-medium">{link.currentUses}{link.maxUses ? `/${link.maxUses}` : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Provider</span>
                  <span className="font-medium text-blue-600">{link.providerId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{new Date(link.createdAt).toLocaleDateString()}</span>
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
        )}

        {!isLoading && !error && filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment links found</p>
            <Button variant="primary" icon={Plus} className="mt-4" onClick={() => openModal('createPaymentLink')}>
              Create Your First Link
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentLinksTab;