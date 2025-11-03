import { useQuery } from '@tanstack/react-query';
import { merchantService } from '../../services';

export const useBusinessInfo = () => {
  return useQuery({
    queryKey: ['business-info'],
    queryFn: () => merchantService.getBusinessInfo(),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => merchantService.getNotificationSettings(),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

export const useSecuritySettings = () => {
  return useQuery({
    queryKey: ['security-settings'],
    queryFn: () => merchantService.getSecuritySettings(),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};