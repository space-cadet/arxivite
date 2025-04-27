import { useState, useEffect } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Get initial value from localStorage or default
  const [state, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}