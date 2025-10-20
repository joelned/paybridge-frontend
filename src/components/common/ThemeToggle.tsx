// src/components/common/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 rounded-lg"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={`Current: ${theme} mode (${effectiveTheme})`}
    >
      <Icon size={18} className="text-gray-600 dark:text-gray-400" />
    </Button>
  );
};