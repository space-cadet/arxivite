import { Bookmark, BookmarkStore, BookmarkService } from './types';

export function createBookmarkService(store: BookmarkStore): BookmarkService {
  return {
    addBookmark(bookmark) {
      console.log('Store before update:', store);
      const newBookmark: Bookmark = {
        ...bookmark,
        dateAdded: new Date(),
      };
      console.log('New bookmark being added:', newBookmark);
      const updatedStore = {
        ...store,
        bookmarks: {
          ...store.bookmarks,
          [bookmark.paperId]: newBookmark
        }
      };
      console.log('Store after update:', updatedStore);
      return updatedStore;
    },

    removeBookmark(paperId) {
      const { [paperId]: removed, ...remaining } = store.bookmarks;
      return {
        ...store,
        bookmarks: remaining
      };
    },

    isBookmarked(paperId) {
      return paperId in store.bookmarks;
    },

    getBookmark(paperId) {
      return store.bookmarks[paperId];
    },

    getAllBookmarks() {
      return Object.values(store.bookmarks);
    },
  };
}