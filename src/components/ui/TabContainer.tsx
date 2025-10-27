// src/components/ui/TabContainer.tsx
import { useState } from 'react';
import { flushSync } from 'react-dom';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export const TabContainer = ({ 
  tabs, 
  defaultTab, 
  className = '' 
}: TabContainerProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => flushSync(() => setActiveTab(tab.id))}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-6 tab-container">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="tab-content active">
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};