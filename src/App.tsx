import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/app-layout';
import SearchPage from '@/pages/search';
import ProfilePage from '@/pages/profile';
import { ProfileProvider } from '@/contexts/ProfileContext';

export default function App() {
  return (
    <ProfileProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Navigate to="/search" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </ProfileProvider>
  );
}