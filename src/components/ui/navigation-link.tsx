import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  section?: string;
  variant?: "link" | "ghost" | "default";
  className?: string;
}

export function NavigationLink({ 
  to, 
  children, 
  section,
  variant = "ghost",
  className = ""
}: NavigationLinkProps) {
  // If section is provided, add it to the URL
  const href = section ? `${to}?section=${section}` : to;
  
  return (
    <Button
      variant={variant}
      size="sm"
      className={`gap-1.5 ${className}`}
      asChild
    >
      <Link to={href}>
        <Settings className="h-4 w-4" />
        {children}
      </Link>
    </Button>
  );
}