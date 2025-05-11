import { createContext, useContext, useMemo, useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { BookmarkStore, BookmarkContextType, Bookmark } from './types';
import { createBookmarkService } from './service';

const initialStore: BookmarkStore = {
  bookmarks: {},
  collections: [],
};

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = usePersistedState<BookmarkStore>('bookmarks', initialStore);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => {
    const baseService = createBookmarkService(store);
    
    // Wrap service methods with state updates
    return {
      ...baseService,
      addBookmark: (bookmark: Omit<Bookmark, 'dateAdded'>) => {
        try {
          setLoading(true);
          baseService.addBookmark(bookmark);
          setStore({ ...store });
        } catch (e) {
          setError(e as Error);
        } finally {
          setLoading(false);
        }
      },
      removeBookmark: (paperId: string) => {
        try {
          setLoading(true);
          baseService.removeBookmark(paperId);
          setStore({ ...store });
        } catch (e) {
          setError(e as Error);
        } finally {
          setLoading(false);
        }
      },
    };
  }, [store, setStore]);

  const value = useMemo(
    () => ({
      ...service,
      loading,
      error,
    }),
    [service, loading, error]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
}