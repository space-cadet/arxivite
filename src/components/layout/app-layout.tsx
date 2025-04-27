import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;