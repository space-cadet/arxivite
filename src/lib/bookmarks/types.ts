export interface Bookmark {
  paperId: string;
  dateAdded: Date;
  title: string;
  category: string;
  collections?: string[];
}

export interface BookmarkStore {
  bookmarks: Record<string, Bookmark>;
  collections: string[];
}

export interface BookmarkService {
  addBookmark: (bookmark: Omit<Bookmark, 'dateAdded'>) => void;
  removeBookmark: (paperId: string) => void;
  isBookmarked: (paperId: string) => boolean;
  getBookmark: (paperId: string) => Bookmark | undefined;
  getAllBookmarks: () => Bookmark[];
}

export interface BookmarkContextType extends BookmarkService {
  loading: boolean;
  error: Error | null;
}