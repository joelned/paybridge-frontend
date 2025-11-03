import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { paymentService } from '../../services';
import type { PaymentFilters } from '../../services';

export const usePayments = (filters: PaymentFilters = {}) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentService.getPayments(filters),
    staleTime: 2 * 60 * 1000 // 2 minutes for payments
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentService.getPayment(paymentId),
    enabled: !!paymentId
  });
};

export const useInfinitePayments = (filters: PaymentFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ['payments', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => 
      paymentService.getPayments({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.payments.length === (filters.size || 20);
      return hasMore ? (lastPage.page + 1) : undefined;
    },
    initialPageParam: 0
  });
};