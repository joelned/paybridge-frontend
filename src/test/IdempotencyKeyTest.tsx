import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { useIdempotencyKey } from '../hooks/useIdempotencyKey';
import { generateIdempotencyKey, storeIdempotencyKey, getStoredKey, updateKeyStatus, cleanupExpiredKeys } from '../utils/idempotencyKey';

export const IdempotencyKeyTest: React.FC = () => {
  const { keyState, generateKey, reuseKey, updateStatus, resetKey, getKeyForRetry } = useIdempotencyKey();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testBasicFlow = () => {
    // Test key generation
    const key = generateIdempotencyKey();
    addResult(`Generated key: ${key}`);
    
    // Test storage
    storeIdempotencyKey(key, undefined, 'pending');
    addResult('Stored key as pending');
    
    // Test retrieval
    const stored = getStoredKey(key);
    addResult(`Retrieved key: ${stored ? 'success' : 'failed'}`);
    
    // Test status update
    updateKeyStatus(key, 'pay_123', 'completed');
    addResult('Updated key status to completed');
    
    // Test retrieval after update
    const updated = getStoredKey(key);
    addResult(`Updated data: paymentId=${updated?.paymentId}, status=${updated?.status}`);
  };

  const testHookFlow = () => {
    const key = generateKey();
    addResult(`Hook generated key: ${key}`);
    addResult(`Key state: ${JSON.stringify(keyState)}`);
  };

  const testRetryFlow = () => {
    if (keyState?.key) {
      // Simulate failure
      updateStatus('pay_failed', 'failed');
      addResult('Marked key as failed');
      
      // Test retry
      const retryKey = getKeyForRetry(keyState.key);
      addResult(`Retry key: ${retryKey}`);
    } else {
      addResult('No active key for retry test');
    }
  };

  const testCleanup = () => {
    cleanupExpiredKeys();
    addResult('Cleanup completed');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Idempotency Key Test</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Current Key State:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {keyState ? JSON.stringify(keyState, null, 2) : 'No active key'}
        </pre>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={testBasicFlow}>
          Test Basic Flow
        </Button>
        <Button variant="outline" onClick={testHookFlow}>
          Test Hook Flow
        </Button>
        <Button variant="outline" onClick={testRetryFlow}>
          Test Retry Flow
        </Button>
        <Button variant="outline" onClick={testCleanup}>
          Test Cleanup
        </Button>
        <Button variant="ghost" onClick={resetKey}>
          Reset Key
        </Button>
        <Button variant="ghost" onClick={clearResults}>
          Clear Results
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Test Results:</h3>
        <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};