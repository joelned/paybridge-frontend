import { useEffect, useRef, useCallback } from 'react';

export const useAbortableRequest = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const createAbortableRequest = useCallback(<T>(
    requestFn: (signal: AbortSignal) => Promise<T>
  ) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    return requestFn(controller.signal);
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    createAbortableRequest,
    abort
  };
};