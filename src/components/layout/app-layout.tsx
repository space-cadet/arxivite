import { ReactNode, createContext, useContext, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';
import { MobileNavBottom } from './mobile/MobileNavBottom';
import { LayoutSwitcher, MobileLayout, useLayoutPreference } from '../dev/LayoutSwitcher';
import { ResponsiveIndicator } from '../responsive/ResponsiveIndicator';

interface AppLayoutProps {
  children: ReactNode;
}

interface LayoutContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  isCollapsed: false,
  setIsCollapsed: () => null,
});

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery(breakpoints.ltSm);
  const isTablet = useMediaQuery(`${breakpoints.sm} and ${breakpoints.ltLg}`);
  const { activeLayout } = useLayoutPreference();
  
  // Determine if we should use mobile layout
  const useMobileLayout = isMobile || (isTablet && activeLayout !== MobileLayout.CONDENSED);
  
  // Force collapse on tablet with condensed layout
  const shouldForceCollapse = isTablet && activeLayout === MobileLayout.CONDENSED;
  
  // Apply forced collapse if needed
  if (shouldForceCollapse && !isCollapsed) {
    setIsCollapsed(true);
  }

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background">
        {/* Only render sidebar on desktop or condensed tablet layout */}
        {!useMobileLayout && <Sidebar />}
        
        <div className={cn(
          "transition-all duration-300 flex flex-col min-h-screen",
          !useMobileLayout && !isCollapsed && "pl-64",
          !useMobileLayout && isCollapsed && "pl-16",
          useMobileLayout && "pl-0"
        )}>
          <Header />
          <main className="flex-1 py-6 px-0 pb-24">
            {children}
          </main>
          
          {/* Mobile Navigation - Always visible on mobile */}
          {useMobileLayout && activeLayout === MobileLayout.BOTTOM_NAV && (
            <MobileNavBottom />
          )}
          
          {/* Show other mobile nav variants based on activeLayout */}
          {/* These will be implemented as we create each variant */}
        </div>
        
        {/* Development tools - only visible in dev mode */}
        <ResponsiveIndicator />
        <LayoutSwitcher />
      </div>
    </LayoutContext.Provider>
  );
};

export default AppLayout;

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
