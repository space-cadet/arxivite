import { Bookmark, BookmarkStore, BookmarkService } from './types';

export function createBookmarkService(store: BookmarkStore): BookmarkService {
  return {
    addBookmark(bookmark) {
      const newBookmark: Bookmark = {
        ...bookmark,
        dateAdded: new Date(),
      };
      store.bookmarks[bookmark.paperId] = newBookmark;
    },

    removeBookmark(paperId) {
      delete store.bookmarks[paperId];
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