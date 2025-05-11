import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";

/**
 * A simple component that displays the current responsive breakpoint.
 * Useful for development and testing of responsive layouts.
 * Can be conditionally rendered only in development mode.
 */
export function ResponsiveIndicator() {
  // Use the mediaQuery hook to check various breakpoints
  const isMobile = useMediaQuery(breakpoints.ltSm);
  const isTablet = useMediaQuery(`${breakpoints.sm} and ${breakpoints.ltLg}`);
  const isDesktop = useMediaQuery(breakpoints.lg);
  
  // Determine current size for display
  const currentSize = isMobile 
    ? 'Mobile (<640px)' 
    : isTablet 
      ? 'Tablet (640px-1023px)' 
      : isDesktop 
        ? 'Desktop (≥1024px)'
        : 'Unknown';
  
  // Color based on size
  const bgColor = isMobile 
    ? 'bg-red-500' 
    : isTablet 
      ? 'bg-yellow-500' 
      : 'bg-green-500';
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-3 right-3 z-50 py-1 px-2 text-xs font-mono text-white rounded-md opacity-80 ${bgColor}`}
    >
      {currentSize}
    </div>
  );
}
