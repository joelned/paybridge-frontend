import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../../services';
import type { CreatePaymentRequest } from '../../services';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.createPayment(data),
    onSuccess: () => {
      // Invalidate and refetch payments
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount?: number }) => 
      paymentService.refundPayment(paymentId, amount),
    onSuccess: (_, variables) => {
      // Update the specific payment in cache
      queryClient.invalidateQueries({ queryKey: ['payment', variables.paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentService.cancelPayment(paymentId),
    onSuccess: (_, paymentId) => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });
};