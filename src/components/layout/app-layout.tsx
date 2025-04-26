import { useState } from 'react';
import { Menu, Search, BookOpen } from 'lucide-react';
import ModeToggle from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                {/* Filter options go here */}
                {children}
              </SheetContent>
            </Sheet>
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex flex-1 items-center space-x-2">
            <Input
              type="search"
              placeholder="Search papers..."
              className="h-9 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar - Hidden on mobile */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="h-full py-6 pl-4 pr-6">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            {/* Add filter components here */}
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;