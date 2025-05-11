import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Search, UserCircle, Clock } from "lucide-react";

/**
 * Bottom navigation bar component for mobile screens.
 * Displays fixed navigation at the bottom of the screen with icon + label format.
 */
export function MobileNavBottom() {
  const location = useLocation();
  
  const navItems = [
    { path: '/search', label: 'Search', icon: Search },
    { path: '/catchup', label: 'Catchup', icon: Clock },
    { path: '/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 py-1 w-full max-w-full overflow-x-hidden mobile-safe-area">
      <nav className="flex justify-evenly items-center w-full">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center py-3 px-4 gap-1 min-w-[72px] flex-1",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
