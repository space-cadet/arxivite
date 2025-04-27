import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Search, UserCircle, Clock } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/search', label: 'Search', icon: Search },
    { path: '/catchup', label: 'Catchup', icon: Clock },
    { path: '/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="w-64 border-r h-screen bg-background p-4 fixed">
      <div className="flex items-center mb-8 px-2">
        <h2 className="text-lg font-semibold">ArXivite</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              location.pathname === path 
                ? "bg-secondary text-secondary-foreground" 
                : "hover:bg-secondary/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;