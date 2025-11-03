// Test component to verify toast functionality
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';

export const ToastTest: React.FC = () => {
  const { showToast, success, error, warning, info } = useToast();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Toast Test Component</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => showToast('Generic success message', 'success')}>
          Generic Success
        </Button>
        <Button onClick={() => showToast('Generic error message', 'error')}>
          Generic Error
        </Button>
        <Button onClick={() => showToast('Generic warning message', 'warning')}>
          Generic Warning
        </Button>
        <Button onClick={() => showToast('Generic info message', 'info')}>
          Generic Info
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => success('Success Title', 'Success message')}>
          Success Method
        </Button>
        <Button onClick={() => error('Error Title', 'Error message')}>
          Error Method
        </Button>
        <Button onClick={() => warning('Warning Title', 'Warning message')}>
          Warning Method
        </Button>
        <Button onClick={() => info('Info Title', 'Info message')}>
          Info Method
        </Button>
      </div>

      <Button onClick={() => {
        showToast('First toast', 'success');
        setTimeout(() => showToast('Second toast', 'info'), 500);
        setTimeout(() => showToast('Third toast', 'warning'), 1000);
      }}>
        Test Multiple Toasts
      </Button>
    </div>
  );
};