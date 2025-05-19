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
import { DEFAULT_SEARCH_CONFIG, SearchConfig } from '@/config/search';

const SearchPage = () => {
  // Add scroll and paper state persistence
  useScrollState('search');
  const paperState = usePaperState('search');
  const [searchInput, setSearchInput] = usePersistedState('search.input', '');
  const [searchConfig, setSearchConfig] = usePersistedState<SearchConfig>('search.config', DEFAULT_SEARCH_CONFIG);
  const [authorFilter, setAuthorFilter] = usePersistedState('search.authorFilter', '');
  const [selectedCategory, setSelectedCategory] = usePersistedState('search.category', 'all');
  const [availableCategories, setAvailableCategories] = usePersistedState<string[]>('search.availableCategories', []);
  
  const { profile } = useProfile();
  const arxivSearch = useArxivSearch();
  
  // Add a search key to force refetch when search is triggered
  const [searchKey, setSearchKey] = usePersistedState('search.key', 0);

  const setPageSize = (size: 20 | 50 | 100) => {
    setSearchConfig(prev => ({ ...prev, pageSize: size }));
  };

  const setCurrentPage = (page: number) => {
    setSearchConfig(prev => ({ ...prev, currentPage: page }));
  };

  const setSortField = (field: SearchConfig['sortField']) => {
    setSearchConfig(prev => ({ ...prev, sortField: field }));
  };

  const setSortOrder = (order: SearchConfig['sortOrder']) => {
    setSearchConfig(prev => ({ ...prev, sortOrder: order }));
  };
  
  const { data, isLoading, error } = arxivSearch.search({ 
    query: searchInput || '',
    pagination: {
      pageSize: searchConfig.pageSize,
      page: searchConfig.currentPage
    },
    sort: {
      field: searchConfig.sortField,
      order: searchConfig.sortOrder
    },
    searchKey
  });

  const arxivPapers = data?.papers || [];
  
  // Convert arXiv papers to our application's Paper type
  const papers = useMemo(() => {
    if (!arxivPapers.length) return [];
    return arxivPapers.map(arxivToPaper);
  }, [arxivPapers]);

  // Debug logging - only when dependencies change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Search state:', {
        searchInput,
        pageSize: searchConfig.pageSize,
        currentPage: searchConfig.currentPage,
        totalResults: data?.metadata?.totalResults,
        papers: papers.length
      });
    }
  }, [searchInput, searchConfig.pageSize, searchConfig.currentPage, data?.metadata?.totalResults, papers.length]);
  
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

  const handleSort = (field: SearchConfig['sortField']) => {
    if (field === searchConfig.sortField) {
      // If clicking the same field, toggle order
      setSortOrder(searchConfig.sortOrder === 'ascending' ? 'descending' : 'ascending');
    } else {
      // If clicking a new field, set it and default to descending
      setSortField(field);
      setSortOrder('descending');
    }
    // Reset to first page and force refetch
    setCurrentPage(0);
    setSearchKey(prev => prev + 1);
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
      
      {/* Debug data structure */}
      <div className="hidden">
        {JSON.stringify(data, null, 2)}
      </div>
    
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {filteredPapers.length > 0 ? (
            <ResponsivePaperList 
              papers={filteredPapers} 
              paperState={paperState}
              tableId="search"
              totalResults={data?.metadata?.totalResults}
              currentPage={searchConfig.currentPage}
              pageSize={searchConfig.pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size as typeof searchConfig.pageSize);
                setCurrentPage(0);
                setSearchKey(prev => prev + 1);
              }}
              isLoading={isLoading}
            />
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