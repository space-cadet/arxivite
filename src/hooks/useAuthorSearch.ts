import { useState, useCallback } from 'react';

interface UseAuthorSearchResult {
  search: (params: { query: string; maxResults?: number }) => Promise<{ papers: any[]; totalResults: number }>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for direct author searches that bypasses LLM processing
 * Uses the same approach as the main arxiv service
 */
export function useAuthorSearch(): UseAuthorSearchResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (params: { query: string; maxResults?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the same URL construction pattern as the main arxiv service
      const url = new URL('https://export.arxiv.org/api/query');
      url.searchParams.append('search_query', params.query); // Use query directly without 'all:' prefix for author queries
      url.searchParams.append('start', '0');
      url.searchParams.append('max_results', String(params.maxResults || 50));
      url.searchParams.append('sortBy', 'submittedDate');
      url.searchParams.append('sortOrder', 'descending');

      console.log('Direct ArXiv request to:', url.toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`ArXiv API error: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // Parse entries using the same pattern as main service
      const entries = Array.from(xmlDoc.getElementsByTagName('entry')).map(entry => {
        const id = entry.getElementsByTagName('id')[0]?.textContent?.split('/').pop() || '';
        const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || '';
        const summary = entry.getElementsByTagName('summary')[0]?.textContent?.trim() || '';
        const published = entry.getElementsByTagName('published')[0]?.textContent || '';
        const updated = entry.getElementsByTagName('updated')[0]?.textContent || '';

        // Parse authors
        const authors = Array.from(entry.getElementsByTagName('author')).map(author => 
          author.getElementsByTagName('name')[0]?.textContent?.trim() || ''
        );

        // Parse categories - include both primary and secondary
        const categories = [
          Array.from(entry.getElementsByTagName('arxiv:primary_category')).map(cat => cat.getAttribute('term') || '')[0],
          ...Array.from(entry.getElementsByTagName('category')).map(cat => cat.getAttribute('term') || '')
        ].filter(Boolean);

        // Parse links
        const links = {
          abstract: Array.from(entry.getElementsByTagName('link')).find(link => !link.getAttribute('title'))?.getAttribute('href') || '',
          pdf: Array.from(entry.getElementsByTagName('link')).find(link => link.getAttribute('title') === 'pdf')?.getAttribute('href') || ''
        };

        return {
          id,
          title,
          summary,
          authors,
          categories,
          published,
          updated,
          links,
          // Additional fields that arxivToPaper might expect
          abstract: summary,
          publishedDate: new Date(published),
          updatedDate: new Date(updated),
          comments: entry.getElementsByTagName('arxiv:comment')[0]?.textContent || '',
          journalRef: entry.getElementsByTagName('arxiv:journal_ref')[0]?.textContent || ''
        };
      });

      // Get total results using the same pattern as main service
      const totalResultsEl = xmlDoc.getElementsByTagName('opensearch:totalResults')[0] || 
                            xmlDoc.getElementsByTagNameNS('http://a9.com/-/spec/opensearch/1.1/', 'totalResults')[0];
      const totalResults = totalResultsEl ? parseInt(totalResultsEl.textContent || '0', 10) : entries.length;

      console.log(`Author search found ${entries.length} entries, total: ${totalResults}`);

      return {
        papers: entries,
        totalResults
      };

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Author search error:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, isLoading, error };
}
