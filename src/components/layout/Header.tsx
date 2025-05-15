import { ModeToggle } from "@/components/mode-toggle"
import { LogoIcon, GitHubIcon } from "@/components/icons"
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery"
import { useLayout } from './app-layout'
import { Link } from 'react-router-dom'

const Header = () => {
  const { isCollapsed } = useLayout();
  const isMobile = useMediaQuery(breakpoints.ltSm);
  const isTablet = useMediaQuery(`${breakpoints.sm} and ${breakpoints.ltLg}`);
  const showHeaderLogo = isMobile || (isTablet && isCollapsed);
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        {showHeaderLogo && (
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LogoIcon size={24} className="text-primary-foreground" />
            <h2 className="text-lg font-semibold">arXivite</h2>
          </Link>
        )}
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/space-cadet/arxivite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitHubIcon size={20} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;