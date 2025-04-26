import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ResearchProfile, DEFAULT_PROFILE } from '@/types/profile';

interface ProfileContextType {
  profile: ResearchProfile;
  updateProfile: (profile: ResearchProfile) => void;
  addToProfile: (key: keyof ResearchProfile, value: string) => void;
  removeFromProfile: (key: keyof ResearchProfile, value: string) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'arxivite-profile';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ResearchProfile>(() => {
    // Try to load from localStorage on initial render
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.lastUpdated = new Date(parsed.lastUpdated); // Convert string back to Date
      return parsed;
    }
    return DEFAULT_PROFILE;
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: ResearchProfile) => {
    setProfile({ ...newProfile, lastUpdated: new Date() });
  };

  const addToProfile = (key: keyof ResearchProfile, value: string) => {
    if (Array.isArray(profile[key])) {
      setProfile(prev => ({
        ...prev,
        [key]: [...(prev[key] as string[]), value],
        lastUpdated: new Date()
      }));
    }
  };

  const removeFromProfile = (key: keyof ResearchProfile, value: string) => {
    if (Array.isArray(profile[key])) {
      setProfile(prev => ({
        ...prev,
        [key]: (prev[key] as string[]).filter(item => item !== value),
        lastUpdated: new Date()
      }));
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      addToProfile,
      removeFromProfile,
      resetProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}