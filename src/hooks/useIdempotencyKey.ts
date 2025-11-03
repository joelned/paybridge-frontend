import { useState, useCallback, useEffect } from 'react';
import { 
  generateIdempotencyKey, 
  storeIdempotencyKey, 
  getStoredKey, 
  updateKeyStatus,
  cleanupExpiredKeys 
} from '../utils/idempotencyKey';

interface IdempotencyKeyState {
  key: string;
  paymentId?: string;
  status?: string;
  isRetry: boolean;
}

export function useIdempotencyKey() {
  const [keyState, setKeyState] = useState<IdempotencyKeyState | null>(null);

  // Cleanup expired keys on mount
  useEffect(() => {
    cleanupExpiredKeys();
  }, []);

  const generateKey = useCallback(() => {
    const key = generateIdempotencyKey();
    const newState: IdempotencyKeyState = {
      key,
      isRetry: false
    };
    
    setKeyState(newState);
    storeIdempotencyKey(key);
    return key;
  }, []);

  const reuseKey = useCallback((existingKey: string) => {
    const stored = getStoredKey(existingKey);
    if (stored) {
      const newState: IdempotencyKeyState = {
        key: existingKey,
        paymentId: stored.paymentId,
        status: stored.status,
        isRetry: true
      };
      setKeyState(newState);
      return existingKey;
    }
    return null;
  }, []);

  const updateStatus = useCallback((paymentId: string, status: string) => {
    if (keyState?.key) {
      updateKeyStatus(keyState.key, paymentId, status);
      setKeyState(prev => prev ? { ...prev, paymentId, status } : null);
    }
  }, [keyState?.key]);

  const resetKey = useCallback(() => {
    setKeyState(null);
  }, []);

  const getKeyForRetry = useCallback((failedKey: string) => {
    const stored = getStoredKey(failedKey);
    if (stored && stored.status === 'failed') {
      return reuseKey(failedKey);
    }
    return generateKey();
  }, [reuseKey, generateKey]);

  return {
    keyState,
    generateKey,
    reuseKey,
    updateStatus,
    resetKey,
    getKeyForRetry
  };
}