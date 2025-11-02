import React, { useState } from 'react';
import { FormModal } from './FormModal';
import { Input } from '../common/Input';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LinkData) => void;
  loading?: boolean;
}

interface LinkData {
  title: string;
  amount: string;
  description: string;
  expiresAt: string;
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<LinkData>({
    title: '',
    amount: '',
    description: '',
    expiresAt: ''
  });

  const handleInputChange = (field: keyof LinkData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Payment Link"
      submitText="Create Link"
      loading={loading}
    >
      <div className="space-y-4">
        <Input
          label="Link Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Product Purchase"
          required
        />
        
        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          placeholder="0.00"
          required
        />
        
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the payment"
        />
        
        <Input
          label="Expires At"
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) => handleInputChange('expiresAt', e.target.value)}
        />
      </div>
    </FormModal>
  );
};