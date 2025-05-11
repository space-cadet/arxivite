# Responsive Components and Utilities

This directory contains responsive utilities and components for ArXivite.

## useMediaQuery Hook

The `useMediaQuery` hook in `/src/hooks/useMediaQuery.ts` allows you to conditionally render components or apply styling based on screen size.

### Basic Usage

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

### With Predefined Breakpoints

```tsx
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isDesktop = useMediaQuery(breakpoints.lg);
  
  return (
    <div className={`p-2 ${isDesktop ? 'max-w-4xl mx-auto' : 'w-full'}`}>
      {/* Component content */}
    </div>
  );
}
```

## ResponsiveIndicator Component

The `ResponsiveIndicator` component displays the current breakpoint size during development. 
Add it to your main layout component to help with responsive development:

```tsx
import { ResponsiveIndicator } from '@/components/responsive/ResponsiveIndicator';

function AppLayout({ children }) {
  return (
    <div>
      {children}
      {process.env.NODE_ENV === 'development' && <ResponsiveIndicator />}
    </div>
  );
}
```

## Responsive Best Practices

1. Use Tailwind's built-in responsive modifiers (sm:, md:, lg:, etc.) whenever possible
2. Use the useMediaQuery hook for conditional rendering of components
3. Follow mobile-first approach (default styles for mobile, then add modifiers for larger screens)
4. Test on multiple device sizes and orientations
5. Ensure touch targets are at least 44x44px for mobile users
