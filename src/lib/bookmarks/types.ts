export interface Bookmark {
  paperId: string;
  dateAdded: Date;
  title: string;
  category: string;
  collections?: string[];
  paperData: any; // Store the full paper data
}

export interface BookmarkStore {
  bookmarks: Record<string, Bookmark>;
  collections: string[];
}

export interface BookmarkService {
  addBookmark: (bookmark: Omit<Bookmark, 'dateAdded'>) => BookmarkStore;
  removeBookmark: (paperId: string) => BookmarkStore;
  isBookmarked: (paperId: string) => boolean;
  getBookmark: (paperId: string) => Bookmark | undefined;
  getAllBookmarks: () => Bookmark[];
}

export interface BookmarkContextType extends BookmarkService {
  loading: boolean;
  error: Error | null;
  resetBookmarks: () => void;
}