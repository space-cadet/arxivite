import { createContext, useContext, ReactNode } from 'react';
import { ResearchProfile, DEFAULT_PROFILE } from '@/types/profile';
import { usePersistedState } from '@/hooks/usePersistedState';

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
  const [profile, setProfile] = usePersistedState<ResearchProfile>(STORAGE_KEY, DEFAULT_PROFILE);

  const updateProfile = (newProfile: ResearchProfile) => {
    setProfile({ ...newProfile, lastUpdated: new Date() });
  };

  const addToProfile = (key: keyof ResearchProfile, value: string) => {
    if (Array.isArray(profile[key])) {
      setProfile((prev: ResearchProfile): ResearchProfile => {
        const updated = { ...prev };
        (updated[key] as string[]) = [...(prev[key] as string[]), value];
        updated.lastUpdated = new Date();
        return updated;
      });
    }
  };

  const removeFromProfile = (key: keyof ResearchProfile, value: string) => {
    if (Array.isArray(profile[key])) {
      setProfile((prev: ResearchProfile): ResearchProfile => {
        const updated = { ...prev };
        (updated[key] as string[]) = (prev[key] as string[]).filter(item => item !== value);
        updated.lastUpdated = new Date();
        return updated;
      });
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