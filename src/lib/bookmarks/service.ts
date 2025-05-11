import { Bookmark, BookmarkStore, BookmarkService } from './types';

export function createBookmarkService(store: BookmarkStore): BookmarkService {
  return {
    addBookmark(bookmark) {
      const newBookmark: Bookmark = {
        ...bookmark,
        dateAdded: new Date(),
      };
      return {
        ...store,
        bookmarks: {
          ...store.bookmarks,
          [bookmark.paperId]: newBookmark
        }
      };
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