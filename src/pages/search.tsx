import { useEffect, useMemo } from 'react';
import { PaginationControls } from '@/components/papers/pagination-controls';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useScrollState } from '@/hooks/useScrollState';
import { usePaperState } from '@/hooks/usePaperState';
import { arxivToPaper } from '@/types/paper';
import { ResponsivePaperList } from '@/components/papers/responsive-paper-list';
import PaperFilters from '@/components/papers/paper-filters';
import { useArxivSearch } from '@/hooks/useArxiv';
import { useProfile } from '@/contexts/ProfileContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage = () => {
  // Add scroll and paper state persistence
  useScrollState('search');
  const paperState = usePaperState('search');
  const [searchInput, setSearchInput] = usePersistedState('search.input', '');
  const [pageSize, setPageSize] = usePersistedState<20 | 50 | 100>('search.pageSize', 20);
  const [currentPage, setCurrentPage] = usePersistedState('search.currentPage', 0);
  const [authorFilter, setAuthorFilter] = usePersistedState('search.authorFilter', '');
  const [selectedCategory, setSelectedCategory] = usePersistedState('search.category', 'all');
  const [availableCategories, setAvailableCategories] = usePersistedState<string[]>('search.availableCategories', []);
  
  const { profile } = useProfile();
  const arxivSearch = useArxivSearch();
  
  // Add a search key to force refetch when search is triggered
  const [searchKey, setSearchKey] = usePersistedState('search.key', 0);
  
  const { data, isLoading, error } = arxivSearch.search({ 
    query: searchInput,
    pagination: {
      pageSize,
      page: currentPage
    },
    searchKey
  });

  // Convert arXiv papers to our application's Paper type
  const papers = useMemo(() => {
    if (!data?.papers?.length) return [];
    return data.papers.map(arxivToPaper);
  }, [data?.papers]);

  // Debug logging
  console.log('Search state:', {
    searchInput,
    pageSize,
    currentPage,
    totalResults: data?.metadata?.totalResults,
    papers: papers.length
  });
  const arxivPapers = data?.papers || [];
  
  // Convert arXiv papers to our application's Paper type
  const papers = useMemo(() => {
    if (!arxivPapers.length) return [];
    return arxivPapers.map(arxivToPaper);
  }, [arxivPapers]);
  
  useEffect(() => {
    const uniqueCategories = new Set<string>();
    profile.categories.forEach(cat => uniqueCategories.add(cat));
    papers.forEach(paper => {
      paper.categories.forEach(cat => uniqueCategories.add(cat));
    });
    setAvailableCategories(Array.from(uniqueCategories).sort());
  }, [papers, profile.categories, setAvailableCategories]);
  
  const filteredPapers = useMemo(() => {
    if (!papers.length) return [];
    
    return papers.filter(paper => {
      const authorMatch = !authorFilter || 
        paper.authors.some(author => 
          author.toLowerCase().includes(authorFilter.toLowerCase())
        );
      
      const categoryMatch = selectedCategory === 'all' || 
        paper.categories.includes(selectedCategory);
      
      const noExcludedTerms = !profile.excludeTerms.some(term => 
        paper.title.toLowerCase().includes(term.toLowerCase()) || 
        paper.abstract.toLowerCase().includes(term.toLowerCase())
      );
      
      return authorMatch && categoryMatch && noExcludedTerms;
    });
  }, [papers, authorFilter, selectedCategory, profile.excludeTerms]);
  
  const handleSearch = (query: string) => {
    setSearchInput(query);
    // Reset to first page on new search
    setCurrentPage(0);
    // Increment search key to force refetch even if query hasn't changed
    setSearchKey(prev => prev + 1);
  };
  
  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <PaperFilters 
        searchValue={searchInput}
        authorValue={authorFilter}
        categoryValue={selectedCategory}
        onSearch={handleSearch}
        onAuthorSearch={handleAuthorSearch}
        onCategorySelect={handleCategorySelect}
        categories={availableCategories}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading papers: {error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Pagination Controls */}
      {/* Debug data structure */}
      <div className="hidden">
        {JSON.stringify(data, null, 2)}
      </div>
      
      {/* Show pagination if we have results */}
      {data?.papers?.length > 0 && data?.metadata && Number.isFinite(data.metadata.totalResults) && (
        <div>
          <PaginationControls
            currentPage={currentPage}
            pageSize={pageSize}
            totalResults={data.metadata.totalResults}
            onPageChange={(page) => {
              setCurrentPage(page);
              // Force refetch when page changes
              setSearchKey(prev => prev + 1);
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0); // Reset to first page
              // Force refetch when page size changes
              setSearchKey(prev => prev + 1);
            }}
            isLoading={isLoading}
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {filteredPapers.length > 0 ? (
            <ResponsivePaperList papers={filteredPapers} paperState={paperState} />
          ) : (
            searchInput && (
              <Alert>
                <AlertDescription>
                  No papers match your search criteria. Try adjusting your filters or search query.
                </AlertDescription>
              </Alert>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;