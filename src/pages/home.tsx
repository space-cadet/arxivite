import { useState, useMemo, useEffect } from 'react';
import { Paper, arxivToPaper } from '@/types/paper';
import PaperTable from '@/components/papers/paper-table';
import PaperFilters from '@/components/papers/paper-filters';
import { useArxivSearch } from '@/hooks/useArxiv';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_SEARCH_QUERY = 'cat:cs.AI';

const HomePage = () => {
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { papers: arxivPapers, isLoading, error, search } = useArxivSearch();
  
  const papers = useMemo(() => arxivPapers.map(arxivToPaper), [arxivPapers]);

  useEffect(() => {
    // Initial search when component mounts
    search({ query: DEFAULT_SEARCH_QUERY, maxResults: 25 });
  }, [search]);

  // Get unique categories from papers
  const categories = useMemo(() => {
    return Array.from(new Set(papers.map(paper => paper.category)));
  }, [papers]);

  // Filter papers based on search criteria
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const authorMatch = authorFilter === '' || paper.authors.some(
        author => author.toLowerCase().includes(authorFilter.toLowerCase())
      );
      const categoryMatch = categoryFilter === '' || categoryFilter === 'all' || paper.category === categoryFilter;
      return authorMatch && categoryMatch;
    });
  }, [papers, authorFilter, categoryFilter]);

  // Handle search with filters
  const handleSearch = (query: string) => {
    const searchQuery = [];
    if (query) searchQuery.push(query);
    if (categoryFilter && categoryFilter !== 'all') searchQuery.push(`cat:${categoryFilter}`);
    if (authorFilter) searchQuery.push(`au:"${authorFilter}"`);
    
    const finalQuery = searchQuery.join(' AND ') || DEFAULT_SEARCH_QUERY;
    search({ query: finalQuery, maxResults: 25 });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Latest Papers
        </h1>
      </div>
      
      <div className="flex flex-col gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Error loading papers: {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        <PaperFilters
          onAuthorSearch={setAuthorFilter}
          onCategorySelect={setCategoryFilter}
          onSearch={handleSearch}
          categories={categories}
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <PaperTable papers={filteredPapers} />
        )}
      </div>
    </div>
  );
};

export default HomePage;