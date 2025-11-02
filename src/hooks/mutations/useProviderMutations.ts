import { useOptimisticMutation } from './useOptimisticMutation';
import { axiosInstance } from '../../services/api/axiosConfig';
import { useToast } from '../../contexts/ToastContext';

interface CreateProviderData {
  name: string;
  type: string;
  config: Record<string, any>;
  enabled?: boolean;
}

interface UpdateProviderData {
  id: string;
  name?: string;
  config?: Record<string, any>;
  enabled?: boolean;
}

export const useCreateProvider = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (data: CreateProviderData, signal: AbortSignal) => {
      const response = await axiosInstance.post('/providers', data, { signal });
      return response.data;
    },
    queryKey: ['providers'],
    optimisticUpdate: (oldData: any[], variables) => {
      const optimisticProvider = {
        id: `temp-${Date.now()}`,
        ...variables,
        enabled: variables.enabled ?? true,
        createdAt: new Date().toISOString(),
        totalTransactions: 0,
        successfulTransactions: 0,
        totalAmount: 0
      };
      return [...(oldData || []), optimisticProvider];
    },
    onSuccess: () => {
      showToast('Provider added successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to add provider: ${error.message}`, 'error');
    }
  });
};

export const useUpdateProvider = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (data: UpdateProviderData, signal: AbortSignal) => {
      const response = await axiosInstance.put(`/providers/${data.id}`, data, { signal });
      return response.data;
    },
    queryKey: ['providers'],
    optimisticUpdate: (oldData: any[], variables) => {
      return oldData?.map(provider => 
        provider.id === variables.id 
          ? { ...provider, ...variables }
          : provider
      ) || [];
    },
    onSuccess: () => {
      showToast('Provider updated successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to update provider: ${error.message}`, 'error');
    }
  });
};

export const useToggleProvider = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }, signal: AbortSignal) => {
      const response = await axiosInstance.patch(`/providers/${id}/toggle`, { enabled }, { signal });
      return response.data;
    },
    queryKey: ['providers'],
    optimisticUpdate: (oldData: any[], { id, enabled }) => {
      return oldData?.map(provider => 
        provider.id === id 
          ? { ...provider, enabled }
          : provider
      ) || [];
    },
    onSuccess: (_, { enabled }) => {
      showToast(`Provider ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
    },
    onError: (error) => {
      showToast(`Failed to toggle provider: ${error.message}`, 'error');
    }
  });
};

export const useDeleteProvider = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (id: string, signal: AbortSignal) => {
      await axiosInstance.delete(`/providers/${id}`, { signal });
      return id;
    },
    queryKey: ['providers'],
    optimisticUpdate: (oldData: any[], id) => {
      return oldData?.filter(provider => provider.id !== id) || [];
    },
    onSuccess: () => {
      showToast('Provider deleted successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to delete provider: ${error.message}`, 'error');
    }
  });
};