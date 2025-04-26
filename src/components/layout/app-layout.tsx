import { ReactNode } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;