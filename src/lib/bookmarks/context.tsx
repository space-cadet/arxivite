import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { BookmarkStore, BookmarkContextType, Bookmark } from './types';
import { createBookmarkService } from './service';

const initialStore: BookmarkStore = {
  bookmarks: {},
  collections: [],
};

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  // When this key changes, it forces a re-initialization of the store
  const [storeKey, setStoreKey] = useState<string>('bookmarks');
  const [store, setStore] = usePersistedState<BookmarkStore>(storeKey, initialStore);
  
  // Function to completely reset the bookmark storage
  const resetBookmarks = useCallback(() => {
    setStore(initialStore);
  }, [setStore]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const service = useMemo(() => {
    console.log('BookmarkProvider: Creating service with store:', store);
    const baseService = createBookmarkService(store);
    
    // Wrap service methods with state updates
    return {
      ...baseService,
      ...baseService,
      addBookmark: (bookmark: Omit<Bookmark, 'dateAdded'>) => {
        console.log('BookmarkProvider: Adding bookmark:', bookmark);
        console.log('BookmarkProvider: Current store:', store);
        try {
          setLoading(true);
          console.log('Complete bookmark data being saved:', bookmark);
          const newStore = baseService.addBookmark(bookmark);
          console.log('BookmarkProvider: New store after add:', newStore);
          setStore(newStore);
          return newStore;
        } catch (e) {
          console.error('BookmarkProvider: Error adding bookmark:', e);
          setError(e as Error);
          return store;
        } finally {
          setLoading(false);
        }
      },
      removeBookmark: (paperId: string) => {
        console.log('BookmarkProvider: Removing bookmark:', paperId);
        console.log('BookmarkProvider: Current store:', store);
        try {
          setLoading(true);
          const newStore = baseService.removeBookmark(paperId);
          console.log('BookmarkProvider: New store after remove:', newStore);
          setStore(newStore);
          return newStore;
        } catch (e) {
          console.error('BookmarkProvider: Error removing bookmark:', e);
          setError(e as Error);
          return store;
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
      resetBookmarks,
    }),
    [service, loading, error, resetBookmarks]
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