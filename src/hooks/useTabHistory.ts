// src/hooks/useTabHistory.ts
import { useState, useEffect } from 'react';

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

  const addToHistory = (tab: string) => {
    setHistory(prev => {
      const filtered = prev.filter(t => t !== tab);
      const newHistory = [tab, ...filtered].slice(0, MAX_HISTORY_SIZE);
      localStorage.setItem(TAB_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const getRecentTabs = (currentTab: string, limit = 3) => {
    return history.filter(tab => tab !== currentTab).slice(0, limit);
  };

  return { addToHistory, getRecentTabs, history };
};