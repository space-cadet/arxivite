import { ModeToggle } from "@/components/mode-toggle"
import { LogoIcon } from "@/components/icons"
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery"
import { useLayout } from './app-layout'

const Header = () => {
  const { isCollapsed } = useLayout();
  const isMobile = useMediaQuery(breakpoints.ltSm);
  const isTablet = useMediaQuery(`${breakpoints.sm} and ${breakpoints.ltLg}`);
  const showHeaderLogo = isMobile || (isTablet && isCollapsed);
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        {showHeaderLogo && (
          <div className="flex items-center gap-2">
            <LogoIcon size={24} className="text-primary-foreground" />
            <h2 className="text-lg font-semibold">ArXivite</h2>
          </div>
        )}
        <div className="flex-1"></div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;