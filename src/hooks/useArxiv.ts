import { useQuery } from '@tanstack/react-query';
import type { ArxivSearchParams } from '../types/arxiv';
import { arxiv } from '@/lib/arxiv';

export function useArxivSearch() {
  const search = (params: ArxivSearchParams & { searchKey?: number }) => {
    return useQuery({
      queryKey: ['arxiv', params.query, params.pagination?.pageSize, params.pagination?.page, params.searchKey],
      queryFn: async () => {
        const response = await arxiv.search(params);
        return response; // Return the complete response including metadata
      },
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      enabled: !!params.query?.trim(), // Only run if we have a query
    });
  };

  return { search };
}