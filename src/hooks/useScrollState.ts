// src/hooks/useScrollState.ts
import { useEffect } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

export function useScrollState(key: string) {
  const [scrollPosition, setScrollPosition] = usePersistedState<number>(`scroll.${key}`, 0);

  useEffect(() => {
    // Restore scroll position on mount
    window.scrollTo(0, scrollPosition);

    // Save scroll position on unmount and when it changes
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Save final position on unmount
      setScrollPosition(window.scrollY);
    };
  }, []);

  return [scrollPosition, setScrollPosition] as const;
}