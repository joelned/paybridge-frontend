import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

export const LiveRegion: React.FC<Props> = ({ 
  message, 
  priority = 'polite', 
  clearAfter = 5000 
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);
    
    if (clearAfter > 0) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
};