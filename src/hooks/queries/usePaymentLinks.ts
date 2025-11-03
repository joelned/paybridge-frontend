import { useQuery } from '@tanstack/react-query';
import { paymentLinkService } from '../../services';
import type { PaymentLinkFilters } from '../../services';

export const usePaymentLinks = (filters: PaymentLinkFilters = {}) => {
  return useQuery({
    queryKey: ['payment-links', filters],
    queryFn: () => paymentLinkService.getPaymentLinks(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

export const usePaymentLink = (linkId: string) => {
  return useQuery({
    queryKey: ['payment-link', linkId],
    queryFn: () => paymentLinkService.getPaymentLink(linkId),
    enabled: !!linkId
  });
};

export const usePaymentLinkUsage = (linkId: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['payment-link-usage', linkId, page, size],
    queryFn: () => paymentLinkService.getPaymentLinkUsage(linkId, page, size),
    enabled: !!linkId
  });
};

export const usePaymentLinkAnalytics = (linkId?: string, dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['payment-link-analytics', linkId, dateFrom, dateTo],
    queryFn: () => paymentLinkService.getPaymentLinkAnalytics(linkId, dateFrom, dateTo),
    staleTime: 10 * 60 * 1000 // 10 minutes for analytics
  });
};

export const usePaymentLinkPreview = (linkId: string) => {
  return useQuery({
    queryKey: ['payment-link-preview', linkId],
    queryFn: () => paymentLinkService.previewPaymentLink(linkId),
    enabled: !!linkId,
    staleTime: 30 * 60 * 1000 // 30 minutes for preview data
  });
};