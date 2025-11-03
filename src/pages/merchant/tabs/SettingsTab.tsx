import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, CreditCard } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { useModalContext } from '../../../contexts/ModalContext';
import { useToast } from '../../../contexts/ToastContext';
import { useBusinessInfo, useNotificationSettings, useSecuritySettings } from '../../../hooks/queries';
import { useUpdateBusinessInfo, useUpdateNotificationSettings, useUpdateSecuritySettings } from '../../../hooks/mutations';

interface SettingsTabProps {
  userData: any;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ userData }) => {
  const { openModal } = useModalContext();
  const { showToast } = useToast();
  
  const { data: businessInfo, isLoading: businessLoading } = useBusinessInfo();
  const { data: notificationSettings, isLoading: notificationLoading } = useNotificationSettings();
  const { data: securitySettings, isLoading: securityLoading } = useSecuritySettings();
  
  const updateBusinessMutation = useUpdateBusinessInfo();
  const updateNotificationMutation = useUpdateNotificationSettings();
  const updateSecurityMutation = useUpdateSecuritySettings();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessCountry: '',
    email: '',
    notifications: {
      email: true,
      sms: false,
      webhook: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30'
    }
  });
  
  useEffect(() => {
    if (businessInfo) {
      setFormData(prev => ({
        ...prev,
        businessName: businessInfo.businessName || '',
        businessType: businessInfo.businessType || '',
        businessCountry: businessInfo.businessCountry || '',
        email: businessInfo.email || ''
      }));
    }
  }, [businessInfo]);
  
  useEffect(() => {
    if (notificationSettings) {
      setFormData(prev => ({
        ...prev,
        notifications: notificationSettings
      }));
    }
  }, [notificationSettings]);
  
  useEffect(() => {
    if (securitySettings) {
      setFormData(prev => ({
        ...prev,
        security: securitySettings
      }));
    }
  }, [securitySettings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const handleSaveAll = () => {
    try {
      // Update business info
      updateBusinessMutation.mutate({
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessCountry: formData.businessCountry,
        email: formData.email
      });
      
      // Update notification settings
      updateNotificationMutation.mutate({
        email: formData.notifications.email,
        sms: formData.notifications.sms,
        webhook: formData.notifications.webhook
      });
      
      // Update security settings
      updateSecurityMutation.mutate({
        twoFactor: formData.security.twoFactor,
        sessionTimeout: formData.security.sessionTimeout
      });
      
      showToast('Settings updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update settings', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <Button 
          variant="primary" 
          icon={Save} 
          disabled={updateBusinessMutation.isPending || updateNotificationMutation.isPending || updateSecurityMutation.isPending}
          onClick={handleSaveAll}
        >
          Save Changes
        </Button>
      </div>

      {businessLoading || notificationLoading || securityLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User size={20} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Enter business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select business type</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="corporation">Corporation</option>
                    <option value="llc">LLC</option>
                    <option value="non_profit">Non-Profit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Country
                  </label>
                  <select
                    value={formData.businessCountry}
                    onChange={(e) => handleInputChange('businessCountry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="NG">Nigeria</option>
                    <option value="ZA">South Africa</option>
                    <option value="KE">Kenya</option>
                    <option value="GH">Ghana</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="business@example.com"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Bell size={20} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive alerts via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.sms}
                      onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Webhook Notifications</p>
                    <p className="text-sm text-gray-600">Send events to your webhook URL</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications.webhook}
                      onChange={(e) => handleNestedChange('notifications', 'webhook', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Shield size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Auth</p>
                    <p className="text-sm text-gray-600">Extra security layer</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.security.twoFactor}
                      onChange={(e) => handleNestedChange('security', 'twoFactor', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={formData.security.sessionTimeout}
                    onChange={(e) => handleNestedChange('security', 'sessionTimeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CreditCard size={20} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Manage your API keys for integration
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => openModal('info', { title: 'API Keys', message: 'API key management interface would open here.' })}>
                Manage API Keys
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;