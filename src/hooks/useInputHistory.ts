import { useState, KeyboardEvent, useCallback } from 'react';
import { usePersistedState } from './usePersistedState';

interface UseInputHistoryProps {
  id: string;
  maxHistory?: number;
}

export function useInputHistory({ id, maxHistory = 10 }: UseInputHistoryProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = usePersistedState<string[]>(`input-history.${id}`, []);

  const addToHistory = useCallback((value: string) => {
    if (!value.trim()) return;
    
    setHistory(prev => {
      const filtered = prev.filter(item => item !== value);
      return [value, ...filtered].slice(0, maxHistory);
    });
  }, [maxHistory, setHistory]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const currentIndex = history.indexOf(value);
        const nextIndex = currentIndex >= 0 ? Math.min(currentIndex + 1, history.length - 1) : 0;
        setValue(history[nextIndex]);
      }
    }
  }, [history, value, setValue]);

  return {
    value,
    setValue,
    addToHistory,
    handleKeyDown,
    history
  };
}