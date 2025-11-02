import { useOptimisticMutation } from './useOptimisticMutation';
import { axiosInstance } from '../../services/api/axiosConfig';
import { useToast } from '../../contexts/ToastContext';

interface CreatePaymentData {
  amount: number;
  currency: string;
  customerId: string;
  description?: string;
}

interface UpdatePaymentData {
  id: string;
  status?: string;
  metadata?: Record<string, any>;
}

export const useCreatePayment = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (data: CreatePaymentData, signal: AbortSignal) => {
      const response = await axiosInstance.post('/payments', data, { signal });
      return response.data;
    },
    queryKey: ['payments'],
    optimisticUpdate: (oldData: any[], variables) => {
      const optimisticPayment = {
        id: `temp-${Date.now()}`,
        ...variables,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      return [optimisticPayment, ...(oldData || [])];
    },
    onSuccess: () => {
      showToast('Payment created successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to create payment: ${error.message}`, 'error');
    }
  });
};

export const useUpdatePayment = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (data: UpdatePaymentData, signal: AbortSignal) => {
      const response = await axiosInstance.put(`/payments/${data.id}`, data, { signal });
      return response.data;
    },
    queryKey: ['payments'],
    optimisticUpdate: (oldData: any[], variables) => {
      return oldData?.map(payment => 
        payment.id === variables.id 
          ? { ...payment, ...variables }
          : payment
      ) || [];
    },
    onSuccess: () => {
      showToast('Payment updated successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to update payment: ${error.message}`, 'error');
    }
  });
};

export const useDeletePayment = () => {
  const { showToast } = useToast();

  return useOptimisticMutation({
    mutationFn: async (id: string, signal: AbortSignal) => {
      await axiosInstance.delete(`/payments/${id}`, { signal });
      return id;
    },
    queryKey: ['payments'],
    optimisticUpdate: (oldData: any[], id) => {
      return oldData?.filter(payment => payment.id !== id) || [];
    },
    onSuccess: () => {
      showToast('Payment deleted successfully', 'success');
    },
    onError: (error) => {
      showToast(`Failed to delete payment: ${error.message}`, 'error');
    }
  });
};