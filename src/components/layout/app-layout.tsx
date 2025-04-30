import { ReactNode, createContext, useContext, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

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

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className={`transition-all duration-300 ${
          isCollapsed ? "pl-16" : "pl-64"
        } flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-1 py-6 px-4">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default AppLayout;