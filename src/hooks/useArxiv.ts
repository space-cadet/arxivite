import { useQuery, useQueryClient } from '@tanstack/react-query';
import { arxiv } from '../lib/arxiv';
import type { ArxivPaper, ArxivSearchParams } from '../types/arxiv';

export function useArxivSearch() {
  const queryClient = useQueryClient();

  const search = (params: ArxivSearchParams) => {
    return useQuery({
      queryKey: ['arxiv', params.query, params.maxResults],
      queryFn: async () => {
        const response = await arxiv.search(params);
        return {
          papers: response.papers,
          total: response.total
        };
      },
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      enabled: !!params.query?.trim(), // Only run if we have a query
    });
  };

  return { search };
}