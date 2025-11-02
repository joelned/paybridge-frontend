import { useState, useEffect } from 'react';
import { generateIdempotencyKey, getStoredKey, cleanupExpiredKeys } from '../utils/idempotencyKey';

export function useIdempotencyKey() {
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [keyStatus, setKeyStatus] = useState<'new' | 'reused' | 'expired'>('new');

  useEffect(() => {
    // Cleanup expired keys on mount
    cleanupExpiredKeys();
    
    // Generate new key
    const newKey = generateIdempotencyKey();
    setIdempotencyKey(newKey);
    setKeyStatus('new');
  }, []);

  const generateNewKey = () => {
    const newKey = generateIdempotencyKey();
    setIdempotencyKey(newKey);
    setKeyStatus('new');
    return newKey;
  };

  const reuseKey = (key: string) => {
    const stored = getStoredKey(key);
    if (stored) {
      setIdempotencyKey(key);
      setKeyStatus('reused');
      return true;
    }
    return false;
  };

  const checkKeyUsage = (key: string) => {
    return getStoredKey(key);
  };

  return {
    idempotencyKey,
    keyStatus,
    generateNewKey,
    reuseKey,
    checkKeyUsage
  };
}