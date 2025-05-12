import { useCallback } from 'react';
import { Paper } from '@/types/paper';
import { useBookmarkContext } from '@/lib/bookmarks/context';

export function useBookmark() {
  const context = useBookmarkContext();

  const toggleBookmark = useCallback((paper: Paper) => {
    if (context.isBookmarked(paper.id)) {
      context.removeBookmark(paper.id);
    } else {
      context.addBookmark({
        paperId: paper.id,
        title: paper.title,
        category: paper.category,
        paperData: paper, // Store the complete paper object
      });
    }
  }, [context]);

  return {
    isBookmarked: context.isBookmarked,
    toggleBookmark,
    loading: context.loading,
    error: context.error,
  };
}