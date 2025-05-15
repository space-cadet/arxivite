import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Search, UserCircle, Clock, ChevronLeft, ChevronRight, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLayout } from './app-layout';
import { LogoIcon } from '@/components/icons';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useLayout();
  
  const navItems = [
    { path: '/search', label: 'Search', icon: Search },
    { path: '/catchup', label: 'Catchup', icon: Clock },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/profile', label: 'Profile', icon: UserCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-screen bg-background border-r flex-shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LogoIcon 
            size={isCollapsed ? 24 : 28} 
            className="text-primary-foreground flex-shrink-0" 
          />
          <h2 className={cn(
            "text-lg font-semibold transition-all duration-200",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            ArXivite
          </h2>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-secondary/50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="space-y-2 p-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors relative group",
              location.pathname === path 
                ? "bg-secondary text-secondary-foreground" 
                : "hover:bg-secondary/50"
            )}
            title={isCollapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span 
              className={cn(
                "transition-all duration-200 whitespace-nowrap",
                isCollapsed && "w-0 opacity-0 overflow-hidden"
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;