import { useQuery } from '@tanstack/react-query';
import type { ArxivSearchParams } from '../types/arxiv';
import { arxiv } from '@/lib/arxiv';

export function useArxivSearch() {
  const search = (params: ArxivSearchParams) => {
    return useQuery({
      queryKey: ['arxiv', params.query, params.maxResults, params.start],
      queryFn: async () => {
        const response = await arxiv.search(params);
        return {
          papers: response.papers,
          total: response.total
        };
      },
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      enabled: !!params.query?.trim(), // Only run if we have a query
    });
  };

  return { search };
}