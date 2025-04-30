import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered stale after 5 minutes
      gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});