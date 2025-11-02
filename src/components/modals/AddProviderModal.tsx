import React from 'react';
import { providerService } from '../../services';
import { useModal } from '../../hooks/useModal';
import { useForm } from '../../hooks/useForm';
import { AccessibleModal } from '../common/AccessibleModal';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { FormField, FormSelect, FormCheckbox } from '../forms';
import { createProviderSchema, CreateProviderFormData } from '../../validation/providerSchemas';
import { useFocusManagement } from '../../hooks/useAccessibility';

const providerTypeOptions = [
  { value: 'STRIPE', label: 'Stripe' },
  { value: 'PAYSTACK', label: 'Paystack' },
  { value: 'FLUTTERWAVE', label: 'Flutterwave' }
];

export const AddProviderModal: React.FC = () => {
  const { isOpen, close, handleSuccess, handleError } = useModal('addProvider');
  const { focusRef, focusFirst } = useFocusManagement();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useForm<CreateProviderFormData>({
    schema: createProviderSchema,
    defaultValues: {
      name: '',
      type: 'STRIPE',
      priority: 1,
      enabled: true,
      config: {
        apiKey: '',
        secretKey: '',
        webhookSecret: '',
        testMode: true
      }
    }
  });
  
  const selectedType = watch('type');
  
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(focusFirst, 100);
    }
  }, [isOpen, focusFirst]);

  const onSubmit = async (data: CreateProviderFormData) => {
    try {
      await providerService.createProvider({
        name: data.name,
        type: data.type,
        configuration: data.config,
        supportedCurrencies: ['USD'],
        supportedCountries: ['US'],
        fees: { percentage: 0, fixed: 0, currency: 'USD' }
      });
      
      handleSuccess();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={close}
      title="Add Payment Provider"
      size="md"
    >
      <div className="relative" ref={focusRef}>
        <LoadingOverlay isVisible={isSubmitting} text="Adding provider..." />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={control}
            label="Provider Name"
            placeholder="e.g., My Stripe Account"
            required
          />

          <FormSelect
            name="type"
            control={control}
            label="Provider Type"
            options={providerTypeOptions}
            required
          />

          <FormField
            name="priority"
            control={control}
            label="Priority"
            type="number"
            required
          />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Configuration</h3>
            
            {selectedType === 'STRIPE' && (
              <>
                <FormField
                  name="config.apiKey"
                  control={control}
                  label="Publishable Key"
                  placeholder="pk_test_..."
                  required
                />
                <FormField
                  name="config.secretKey"
                  control={control}
                  label="Secret Key"
                  type="password"
                  placeholder="sk_test_..."
                  required
                />
                <FormField
                  name="config.webhookSecret"
                  control={control}
                  label="Webhook Secret"
                  type="password"
                  placeholder="whsec_..."
                  required
                />
                <FormCheckbox
                  name="config.testMode"
                  control={control}
                  label="Test Mode"
                />
              </>
            )}

            {selectedType === 'PAYSTACK' && (
              <>
                <FormField
                  name="config.publicKey"
                  control={control}
                  label="Public Key"
                  placeholder="pk_test_..."
                  required
                />
                <FormField
                  name="config.secretKey"
                  control={control}
                  label="Secret Key"
                  type="password"
                  placeholder="sk_test_..."
                  required
                />
                <FormCheckbox
                  name="config.testMode"
                  control={control}
                  label="Test Mode"
                />
              </>
            )}

            {selectedType === 'FLUTTERWAVE' && (
              <>
                <FormField
                  name="config.publicKey"
                  control={control}
                  label="Public Key"
                  placeholder="FLWPUBK_TEST-..."
                  required
                />
                <FormField
                  name="config.secretKey"
                  control={control}
                  label="Secret Key"
                  type="password"
                  placeholder="FLWSECK_TEST-..."
                  required
                />
                <FormField
                  name="config.encryptionKey"
                  control={control}
                  label="Encryption Key"
                  type="password"
                  required
                />
                <FormCheckbox
                  name="config.testMode"
                  control={control}
                  label="Test Mode"
                />
              </>
            )}
          </div>

          <FormCheckbox
            name="enabled"
            control={control}
            label="Enable Provider"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? 'submit-status' : undefined}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Adding...' : 'Add Provider'}
            </button>
            {isSubmitting && (
              <span id="submit-status" className="sr-only" aria-live="polite">
                Adding provider, please wait
              </span>
            )}
          </div>
        </form>
      </div>
    </AccessibleModal>
  );
};