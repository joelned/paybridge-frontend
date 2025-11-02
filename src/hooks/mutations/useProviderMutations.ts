import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService } from '../../services';
import type { CreateProviderRequest, UpdateProviderRequest, ProviderTestRequest } from '../../services/providerService';

export const useCreateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProviderRequest) => providerService.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    }
  });
};

export const useUpdateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: UpdateProviderRequest }) => 
      providerService.updateProvider(providerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['provider', variables.providerId] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    }
  });
};

export const useDeleteProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providerId: string) => providerService.deleteProvider(providerId),
    onSuccess: (_, providerId) => {
      queryClient.removeQueries({ queryKey: ['provider', providerId] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    }
  });
};

export const useToggleProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, enabled }: { providerId: string; enabled: boolean }) => 
      providerService.toggleProvider(providerId, enabled),
    onMutate: async ({ providerId, enabled }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['provider', providerId] });
      await queryClient.cancelQueries({ queryKey: ['providers'] });

      // Snapshot previous values
      const previousProvider = queryClient.getQueryData(['provider', providerId]);
      const previousProviders = queryClient.getQueryData(['providers']);

      // Optimistically update
      queryClient.setQueryData(['provider', providerId], (old: any) => 
        old ? { ...old, isEnabled: enabled } : old
      );

      queryClient.setQueryData(['providers'], (old: any[]) => 
        old?.map(provider => 
          provider.id === providerId ? { ...provider, isEnabled: enabled } : provider
        )
      );

      return { previousProvider, previousProviders };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProvider) {
        queryClient.setQueryData(['provider', variables.providerId], context.previousProvider);
      }
      if (context?.previousProviders) {
        queryClient.setQueryData(['providers'], context.previousProviders);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['provider', variables.providerId] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    }
  });
};

export const useTestProvider = () => {
  return useMutation({
    mutationFn: ({ providerId, testData }: { providerId: string; testData: ProviderTestRequest }) => 
      providerService.testProvider(providerId, testData)
  });
};