import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { BookmarkProvider } from "@/lib/bookmarks/context";
import AppLayout from "@/components/layout/app-layout";
import SearchPage from "@/pages/search";
import CatchupPage from "@/pages/catchup";
import ProfilePage from "@/pages/profile";
import BookmarksPage from "./pages/bookmarks";
import SettingsPage from "./pages/settings";
import AuthTestPage from "./pages/auth-test";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <BookmarkProvider>
          <Router>
          <AppLayout>
            <Routes>
              <Route path="/search" element={<SearchPage />} />
              <Route path="/catchup" element={<CatchupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth-test" element={<AuthTestPage />} />
              <Route path="/" element={<Navigate to="/search" replace />} />
            </Routes>
          </AppLayout>
          </Router>
        </BookmarkProvider>
      </ProfileProvider>
    </QueryClientProvider>
  );
}