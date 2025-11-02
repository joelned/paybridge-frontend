import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchStateOptions {
  delay?: number;
  initialQuery?: string;
}

export const useSearchState = (options: UseSearchStateOptions = {}) => {
  const { delay = 500, initialQuery = '' } = options;
  
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, delay);
  
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery !== debouncedQuery) {
      setIsLoading(true);
    }
  }, [debouncedQuery]);
  
  const clearSearch = useCallback(() => {
    setQuery('');
    setIsLoading(false);
  }, []);
  
  // Reset loading when debounced query updates
  const isSearching = useMemo(() => {
    if (query === debouncedQuery) {
      setIsLoading(false);
      return false;
    }
    return isLoading;
  }, [query, debouncedQuery, isLoading]);
  
  return {
    query,
    debouncedQuery,
    isSearching,
    handleSearch,
    clearSearch,
    setIsLoading,
  };
};