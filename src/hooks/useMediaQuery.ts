import { useState, useEffect } from 'react';

/**
 * A hook that returns whether the given media query matches.
 * 
 * @param query The media query to match against (e.g. '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  // Default to false to avoid hydration issues
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Only run the effect on the client, once mounted
    const media = window.matchMedia(query);
    
    // Update matches state with initial value
    setMatches(media.matches);
    
    // Define listener function to track changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the event listener
    media.addEventListener('change', listener);
    
    // Clean up function to remove listener when component unmounts
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Only re-run if the query changes
  
  return matches;
}

/**
 * Common screen size presets for convenience
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  // Mobile-first (less than)
  ltSm: '(max-width: 639px)',
  ltMd: '(max-width: 767px)',
  ltLg: '(max-width: 1023px)',
  ltXl: '(max-width: 1279px)',
  lt2Xl: '(max-width: 1535px)',
};
