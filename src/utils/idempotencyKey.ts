interface IdempotencyRecord {
  key: string;
  timestamp: number;
  paymentId?: string;
  status?: 'pending' | 'completed' | 'failed';
}

const STORAGE_KEY = 'paybridge_idempotency_keys';
const EXPIRY_HOURS = 24;

export function generateIdempotencyKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function storeIdempotencyKey(key: string, paymentId?: string, status?: 'pending' | 'completed' | 'failed'): void {
  try {
    const records = getStoredKeys();
    records[key] = {
      key,
      timestamp: Date.now(),
      paymentId,
      status
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to store idempotency key:', error);
  }
}

export function getStoredKey(key: string): IdempotencyRecord | null {
  try {
    const records = getStoredKeys();
    const record = records[key];
    
    if (!record) return null;
    
    // Check if expired
    const hoursOld = (Date.now() - record.timestamp) / (1000 * 60 * 60);
    if (hoursOld > EXPIRY_HOURS) {
      delete records[key];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return null;
    }
    
    return record;
  } catch (error) {
    console.warn('Failed to get stored key:', error);
    return null;
  }
}

export function updateKeyStatus(key: string, paymentId: string, status: 'completed' | 'failed'): void {
  try {
    const records = getStoredKeys();
    if (records[key]) {
      records[key].paymentId = paymentId;
      records[key].status = status;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (error) {
    console.warn('Failed to update key status:', error);
  }
}

export function cleanupExpiredKeys(): void {
  try {
    const records = getStoredKeys();
    const now = Date.now();
    let hasChanges = false;
    
    Object.keys(records).forEach(key => {
      const hoursOld = (now - records[key].timestamp) / (1000 * 60 * 60);
      if (hoursOld > EXPIRY_HOURS) {
        delete records[key];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (error) {
    console.warn('Failed to cleanup expired keys:', error);
  }
}

function getStoredKeys(): Record<string, IdempotencyRecord> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse stored keys:', error);
    return {};
  }
}