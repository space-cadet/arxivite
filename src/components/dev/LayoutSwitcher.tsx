import { useState, useEffect } from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Layout options enum
export enum MobileLayout {
  BOTTOM_NAV = 'bottom-nav',
  DRAWER = 'drawer',
  TABS = 'tabs',
  CONDENSED = 'condensed'
}

// Hook for managing layout preference
export function useLayoutPreference() {
  // Default to bottom navigation
  const [activeLayout, setActiveLayout] = useState<MobileLayout>(MobileLayout.BOTTOM_NAV);
  
  // Load preference from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('mobileLayoutPreference') as MobileLayout;
    if (savedLayout && Object.values(MobileLayout).includes(savedLayout)) {
      setActiveLayout(savedLayout);
    }
  }, []);
  
  // Save preference to localStorage when it changes
  const setLayout = (layout: MobileLayout) => {
    setActiveLayout(layout);
    localStorage.setItem('mobileLayoutPreference', layout);
  };
  
  return { activeLayout, setLayout };
}

// Layout switcher component for development
export function LayoutSwitcher() {
  const { activeLayout, setLayout } = useLayoutPreference();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const layoutOptions = [
    { id: MobileLayout.BOTTOM_NAV, label: 'Bottom Nav' },
    { id: MobileLayout.DRAWER, label: 'Drawer' },
    { id: MobileLayout.TABS, label: 'Tabs' },
    { id: MobileLayout.CONDENSED, label: 'Condensed' }
  ];
  
  return (
    <div className="fixed bottom-16 right-3 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 bg-background border rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-[150px]">
          <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
            Layout Options
          </div>
          {layoutOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className="justify-start gap-2"
              onClick={() => setLayout(option.id)}
            >
              {activeLayout === option.id && <Check className="h-3 w-3" />}
              <span className={activeLayout === option.id ? "font-semibold" : ""}>
                {option.label}
              </span>
            </Button>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
