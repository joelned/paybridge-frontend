// src/components/ui/TabContainer.tsx
import { memo, useState, useEffect } from 'react';

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

export const TabContainer = memo<TabContainerProps>(({ 
  tabs, 
  defaultTab, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [renderedTabs, setRenderedTabs] = useState(new Set([activeTab]));

  useEffect(() => {
    setRenderedTabs(prev => new Set([...prev, activeTab]));
  }, [activeTab]);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}
          >
            {renderedTabs.has(tab.id) && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
});