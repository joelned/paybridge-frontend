import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentLinkService } from '../../services';
import type { CreatePaymentLinkRequest, UpdatePaymentLinkRequest } from '../../services';

export const useCreatePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentLinkRequest) => paymentLinkService.createPaymentLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
      queryClient.invalidateQueries({ queryKey: ['payment-link-analytics'] });
    }
  });
};

export const useUpdatePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, data }: { linkId: string; data: UpdatePaymentLinkRequest }) => 
      paymentLinkService.updatePaymentLink(linkId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment-link', variables.linkId] });
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });
};

export const useDeletePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => paymentLinkService.deletePaymentLink(linkId),
    onSuccess: (_, linkId) => {
      queryClient.removeQueries({ queryKey: ['payment-link', linkId] });
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });
};

export const useTogglePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, active }: { linkId: string; active: boolean }) => 
      paymentLinkService.togglePaymentLink(linkId, active),
    onMutate: async ({ linkId, active }) => {
      await queryClient.cancelQueries({ queryKey: ['payment-link', linkId] });
      
      const previousLink = queryClient.getQueryData(['payment-link', linkId]);
      
      queryClient.setQueryData(['payment-link', linkId], (old: any) => 
        old ? { ...old, status: active ? 'ACTIVE' : 'INACTIVE' } : old
      );

      return { previousLink };
    },
    onError: (err, variables, context) => {
      if (context?.previousLink) {
        queryClient.setQueryData(['payment-link', variables.linkId], context.previousLink);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment-link', variables.linkId] });
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });
};

export const useDuplicatePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, title }: { linkId: string; title?: string }) => 
      paymentLinkService.duplicatePaymentLink(linkId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });
};