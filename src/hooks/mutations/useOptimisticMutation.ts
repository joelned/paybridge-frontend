import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables, signal: AbortSignal) => Promise<TData>;
  queryKey: string[];
  optimisticUpdate?: (oldData: any, variables: TVariables) => any;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
}

export const useOptimisticMutation = <TData, TVariables>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  onSuccess,
  onError
}: OptimisticMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (variables: TVariables) => {
      const controller = new AbortController();
      return mutationFn(variables, controller.signal);
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update
      if (optimisticUpdate) {
        queryClient.setQueryData(queryKey, (old: any) => 
          optimisticUpdate(old, variables)
        );
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return mutation;
};