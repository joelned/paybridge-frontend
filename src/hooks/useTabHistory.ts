// src/hooks/useTabHistory.ts - Fixed infinite loop issue
import { useState, useCallback } from 'react';

const TAB_HISTORY_KEY = 'paybridge-tab-history';
const MAX_HISTORY_SIZE = 10;

export const useTabHistory = () => {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(TAB_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((tab: string) => {
    setHistory(prev => {
      // Don't update if tab is already at the front
      if (prev[0] === tab) return prev;
      
      const filtered = prev.filter(t => t !== tab);
      const newHistory = [tab, ...filtered].slice(0, MAX_HISTORY_SIZE);
      
      try {
        localStorage.setItem(TAB_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Failed to save tab history:', error);
      }
      
      return newHistory;
    });
  }, []);

  const getRecentTabs = useCallback((currentTab: string, limit = 3) => {
    return history.filter(tab => tab !== currentTab).slice(0, limit);
  }, [history]);

  return { addToHistory, getRecentTabs, history };
};