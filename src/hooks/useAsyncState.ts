import { useState, useCallback } from 'react';
import { useAbortableRequest } from './useAbortableRequest';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsyncState = <T>(initialData: T | null = null) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const { createAbortableRequest } = useAbortableRequest();

  const execute = useCallback(async (
    asyncFn: (signal: AbortSignal) => Promise<T>,
    options: { optimisticData?: T } = {}
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      data: options.optimisticData || prev.data
    }));

    try {
      const result = await createAbortableRequest(asyncFn);
      setState({
        data: result,
        loading: false,
        error: null
      });
      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      
      setState(prev => ({
        data: options.optimisticData ? prev.data : null,
        loading: false,
        error: error.message || 'An error occurred'
      }));
      throw error;
    }
  }, [createAbortableRequest]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError
  };
};