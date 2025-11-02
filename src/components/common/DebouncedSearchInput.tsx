import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface DebouncedSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  className?: string;
  showSearchIcon?: boolean;
  showClearButton?: boolean;
  isLoading?: boolean;
}

export const DebouncedSearchInput = React.memo(({
  placeholder = 'Search...',
  onSearch,
  delay = 500,
  className = '',
  showSearchIcon = true,
  showClearButton = true,
  isLoading = false,
}: DebouncedSearchInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedValue = useDebounce(inputValue, delay);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue !== inputValue) {
      setIsSearching(false);
    }
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Show searching indicator while typing
  useEffect(() => {
    if (inputValue !== debouncedValue && inputValue.length > 0) {
      setIsSearching(true);
    }
  }, [inputValue, debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    setIsSearching(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {showSearchIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        )}
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            showSearchIcon ? 'pl-10' : ''
          } ${showClearButton || isSearching || isLoading ? 'pr-10' : ''}`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading && (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          )}
          {!isLoading && isSearching && (
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
          )}
          {!isLoading && !isSearching && showClearButton && inputValue && (
            <button
              onClick={handleClear}
              className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {isSearching && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
});

DebouncedSearchInput.displayName = 'DebouncedSearchInput';