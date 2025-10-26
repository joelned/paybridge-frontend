// src/components/modals/UpdateBusinessInfoModal.tsx
import React, { useState } from 'react';
import { FormModal } from './FormModal';
import { Input } from '../common/Input';

interface UpdateBusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessInfo) => void;
  currentInfo: Partial<BusinessInfo>;
  loading?: boolean;
}

interface BusinessInfo {
  businessName: string;
  email: string;
  businessType: string;
  phone?: string;
  website?: string;
}

export const UpdateBusinessInfoModal: React.FC<UpdateBusinessInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentInfo,
  loading = false
}) => {
  const [formData, setFormData] = useState<BusinessInfo>({
    businessName: currentInfo.businessName || '',
    email: currentInfo.email || '',
    businessType: currentInfo.businessType || '',
    phone: currentInfo.phone || '',
    website: currentInfo.website || ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Business Information"
      submitText="Save Changes"
      loading={loading}
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Business Name"
          value={formData.businessName}
          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
          placeholder="Enter business name"
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="business@example.com"
          required
        />
        
        <Input
          label="Business Type"
          value={formData.businessType}
          onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
          placeholder="E-commerce, SaaS, etc."
          required
        />
        
        <Input
          label="Phone (Optional)"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+1 (555) 123-4567"
        />
        
        <Input
          label="Website (Optional)"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          placeholder="https://example.com"
        />
      </div>
    </FormModal>
  );
};