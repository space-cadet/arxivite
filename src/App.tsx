import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from '@/components/layout/app-layout';
import SearchPage from '@/pages/search';
import ProfilePage from '@/pages/profile';
import CatchupPage from '@/pages/catchup';
import { ProfileProvider } from '@/contexts/ProfileContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/catchup" element={<CatchupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/" element={<Navigate to="/search" replace />} />
              </Routes>
            </AppLayout>
          </Router>
        </ProfileProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}