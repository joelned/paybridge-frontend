import { useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantService } from '../../services';
import { useToast } from '../../contexts/ToastContext';

export const useUpdateBusinessInfo = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: { businessName: string; businessType: string; businessCountry: string; email: string }) =>
      merchantService.updateMerchantProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-info'] });
      showToast('Business information updated successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update business information', 'error');
    }
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: { email: boolean; sms: boolean; webhook: boolean }) =>
      merchantService.updateMerchantSettings({ notifications: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      showToast('Notification settings updated successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update notification settings', 'error');
    }
  });
};

export const useUpdateSecuritySettings = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: { twoFactor: boolean; sessionTimeout: string }) =>
      merchantService.updateMerchantSettings({ security: { twoFactorEnabled: data.twoFactor, sessionTimeout: parseInt(data.sessionTimeout) } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
      showToast('Security settings updated successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to update security settings', 'error');
    }
  });
};