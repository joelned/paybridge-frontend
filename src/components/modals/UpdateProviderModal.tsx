import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProviderType, PaymentProviderData } from '../../types/provider';
import { ProviderConfigForm } from './ProviderConfigForm';
import { validateProviderConfig } from '../../utils/providerValidator';
import { providerService } from '../../services';
import { getErrorMessage, getValidationErrors } from '../../utils/errorHandler';
import { useModal } from '../../hooks/useModal';

export const UpdateProviderModal: React.FC = () => {
  const { isOpen, data, close, handleSuccess, handleError } = useModal('updateProvider');
  const provider = data as PaymentProviderData | null;
  const [formData, setFormData] = useState({
    name: '',
    config: {},
    enabled: true,
    priority: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        config: provider.config || {},
        enabled: provider.enabled,
        priority: provider.priority
      });
      setErrors({});
    }
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!provider) return;

    const validationErrors = validateProviderConfig(provider.type, formData.config);
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Provider name is required';
    }

    validationErrors.forEach(error => {
      const field = error.split(' ')[0].toLowerCase();
      newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await providerService.updateProvider(provider.id!, {
        name: formData.name,
        configuration: formData.config,
        isEnabled: formData.enabled
      });
      
      handleSuccess();
    } catch (error) {
      const validationErrors = getValidationErrors(error);
      if (validationErrors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        validationErrors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: getErrorMessage(error) });
        handleError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Provider</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider Type
            </label>
            <input
              type="text"
              value={provider.type}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <input
              type="number"
              min="1"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Enable Provider
            </label>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Configuration</h3>
            <ProviderConfigForm
              providerType={provider.type}
              config={formData.config}
              onChange={(config) => setFormData(prev => ({ ...prev, config }))}
              errors={errors}
            />
          </div>

          {errors.general && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};