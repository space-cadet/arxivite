import { useState, useCallback } from 'react';
import { arxiv } from '../lib/arxiv';
import type { ArxivPaper, ArxivSearchParams } from '../types/arxiv';

export function useArxivSearch() {
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const search = useCallback(async (params: ArxivSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await arxiv.search(params);
      setPapers(response.papers);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    papers,
    isLoading,
    error,
    total,
    search,
  };
}