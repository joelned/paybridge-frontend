interface IdempotencyKeyData {
  key: string;
  paymentId?: string;
  status?: string;
  timestamp: number;
  expiresAt: number;
}

const STORAGE_PREFIX = 'paybridge-idempotency-';
const EXPIRY_HOURS = 24;

export function generateIdempotencyKey(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `idem_${timestamp}_${random}`;
}

export function storeIdempotencyKey(key: string, paymentId?: string, status?: string): void {
  const now = Date.now();
  const data: IdempotencyKeyData = {
    key,
    paymentId,
    status,
    timestamp: now,
    expiresAt: now + (EXPIRY_HOURS * 60 * 60 * 1000)
  };
  
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
}

export function getStoredKey(key: string): IdempotencyKeyData | null {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!stored) return null;
  
  try {
    const data: IdempotencyKeyData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return null;
    }
    
    return data;
  } catch {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return null;
  }
}

export function updateKeyStatus(key: string, paymentId: string, status: string): void {
  const existing = getStoredKey(key);
  if (existing) {
    storeIdempotencyKey(key, paymentId, status);
  }
}

export function cleanupExpiredKeys(): void {
  const now = Date.now();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const data: IdempotencyKeyData = JSON.parse(localStorage.getItem(key) || '');
        if (now > data.expiresAt) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}