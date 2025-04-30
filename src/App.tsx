import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ProfileProvider } from "@/contexts/ProfileContext";
import AppLayout from "@/components/layout/app-layout";
import SearchPage from "@/pages/search";
import CatchupPage from "@/pages/catchup";
import ProfilePage from "@/pages/profile";

export default function App() {
  return (
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
  );
}