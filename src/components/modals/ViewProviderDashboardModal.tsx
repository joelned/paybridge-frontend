// src/components/modals/ViewProviderDashboardModal.tsx
import React, { useState } from 'react';
import { ExternalLink, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

interface Provider {
  id: number;
  name: string;
  enabled: boolean;
  logo: string;
  color: string;
  apiKey: string;
  transactions: number;
  volume: string;
}

interface ViewProviderDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
}

export const ViewProviderDashboardModal: React.FC<ViewProviderDashboardModalProps> = ({
  isOpen,
  onClose,
  provider
}) => {
  const [redirecting, setRedirecting] = useState(false);

  if (!provider) return null;

  const getDashboardUrl = () => {
    const urls = {
      'Stripe': 'https://dashboard.stripe.com',
      'PayPal': 'https://www.paypal.com/merchantapps',
      'Flutterwave': 'https://dashboard.flutterwave.com',
      'Paystack': 'https://dashboard.paystack.com',
      'Square': 'https://squareup.com/dashboard',
      'Razorpay': 'https://dashboard.razorpay.com'
    };
    return urls[provider.name as keyof typeof urls] || '#';
  };

  const handleRedirect = async () => {
    setRedirecting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.open(getDashboardUrl(), '_blank', 'noopener,noreferrer');
    setRedirecting(false);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Provider Dashboard" size="md">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
          <img src={provider.logo} alt={provider.name} className="w-12 h-12" />
          <div>
            <h3 className="font-semibold text-slate-900">{provider.name}</h3>
            <p className="text-sm text-slate-600">{provider.transactions} transactions • {provider.volume}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Connection Status</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={16} />
              <span className="text-sm text-emerald-600 font-medium">Connected</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-sm font-medium text-slate-700">API Version</span>
            <span className="text-sm text-slate-600">Latest</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Webhook Status</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={16} />
              <span className="text-sm text-emerald-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Redirect</p>
              <p className="text-xs text-blue-700 mt-1">
                You'll be redirected to {provider.name}'s official dashboard in a new tab. 
                Your PayBridge session will remain active.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-amber-900">Important</p>
              <p className="text-xs text-amber-700 mt-1">
                Changes made in the provider dashboard may affect your PayBridge integration. 
                Always test after making configuration changes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            icon={ExternalLink}
            onClick={handleRedirect}
            loading={redirecting}
          >
            Open {provider.name} Dashboard
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};