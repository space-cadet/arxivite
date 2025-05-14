import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Search, UserCircle, Clock, Bookmark, Settings } from "lucide-react";

/**
 * Bottom navigation bar component for mobile screens.
 * Displays fixed navigation at the bottom of the screen with icon + label format.
 */
export function MobileNavBottom() {
  const location = useLocation();
  
  const navItems = [
    { path: '/app/search', label: 'Search', icon: Search },
    { path: '/app/catchup', label: 'Catchup', icon: Clock },
    { path: '/app/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/app/profile', label: 'Profile', icon: UserCircle },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 py-1 w-full max-w-full overflow-x-hidden mobile-safe-area">
      <nav className="flex justify-between items-center w-full px-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center py-2 px-2 gap-1 min-w-[60px] flex-1",
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
