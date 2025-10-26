import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { axiosInstance } from '../../../services/api/axiosConfig';


interface SettingsTabProps {
  userData: {
    businessName?: string;
    email: string;
    [key: string]: any;
  };
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ userData }) => {
  const [webhookUrl, setWebhookUrl] = useState('https://yourdomain.com/webhook');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axiosInstance.get('/get-apikey');
        console.log('API Key response:', response.data);
        setApiKey(response.data.api_key_test || '');
      } catch (error) {
        console.error('Failed to fetch API key:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 max-w-3xl">

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Business Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input 
            label="Business Name" 
            value={userData.businessName || 'Acme Corp'} 
            onChange={() => {}} 
          />
          <Input 
            label="Email" 
            value={userData.email} 
            onChange={() => {}} 
          />
          <div className="sm:col-span-2">
            <Input 
              label="Business Type" 
              value="E-commerce" 
              onChange={() => {}} 
            />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <Button className="w-full sm:w-auto" onClick={() => console.log('Update business info')}>Update Information</Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={loading ? 'Loading...' : apiKey}
                readOnly
                className="w-full sm:flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <Button 
                variant="outline" 
                icon={Copy}
                onClick={() => handleCopyToClipboard(apiKey)}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Use this key to integrate PayBridge into your application</p>
          </div>
          <Input 
            label="Webhook URL" 
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value="whsec_..."
                readOnly
                className="w-full sm:flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <Button 
                variant="outline" 
                icon={Copy}
                onClick={() => handleCopyToClipboard('whsec_...')}
              >
                Copy
              </Button>
            </div>
          </div>
          <Button className="w-full sm:w-auto">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Smart Routing Rules</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Optimize for Success Rate</p>
              <p className="text-sm text-gray-600">Route to provider with highest success rate</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Minimize Fees</p>
              <p className="text-sm text-gray-600">Route to provider with lowest fees</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Geographic Routing</p>
              <p className="text-sm text-gray-600">Route based on customer location</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};