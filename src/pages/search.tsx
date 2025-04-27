import { useState, useEffect, useMemo } from 'react';
import { arxivToPaper } from '@/types/paper';
import PaperTable from '@/components/papers/paper-table';
import PaperFilters from '@/components/papers/paper-filters';
import { useArxivSearch } from '@/hooks/useArxiv';
import { useProfile } from '@/contexts/ProfileContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const { profile } = useProfile();
  const { papers: arxivPapers, isLoading, error, search } = useArxivSearch();
  
  // Convert arXiv papers to our application's Paper type
  const papers = useMemo(() => {
    if (!arxivPapers.length) return [];
    return arxivPapers.map(arxivToPaper);
  }, [arxivPapers]);
  
  // Collect unique categories from papers and profile
  useEffect(() => {
    const uniqueCategories = new Set<string>();
    
    // Add categories from profile
    profile.categories.forEach(cat => uniqueCategories.add(cat));
    
    // Add categories from papers
    papers.forEach(paper => {
      paper.categories.forEach(cat => uniqueCategories.add(cat));
    });
    
    // Convert to sorted array
    setAvailableCategories(Array.from(uniqueCategories).sort());
  }, [papers, profile.categories]);
  
  // Filter papers
  const filteredPapers = useMemo(() => {
    if (!papers.length) return [];
    
    return papers.filter(paper => {
      // Filter by author if specified
      const authorMatch = !authorFilter || 
        paper.authors.some(author => 
          author.toLowerCase().includes(authorFilter.toLowerCase())
        );
      
      // Filter by category if specified and not "all"
      const categoryMatch = selectedCategory === 'all' || 
        paper.categories.includes(selectedCategory);
      
      // Filter out papers with excluded terms
      const noExcludedTerms = !profile.excludeTerms.some(term => 
        paper.title.toLowerCase().includes(term.toLowerCase()) || 
        paper.abstract.toLowerCase().includes(term.toLowerCase())
      );
      
      return authorMatch && categoryMatch && noExcludedTerms;
    });
  }, [papers, authorFilter, selectedCategory, profile.excludeTerms]);
  
  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      search({ query, maxResults: 20 });
    }
    setSearchInput(query);
  };
  
  // Handle author filtering
  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PaperFilters 
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
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {filteredPapers.length > 0 ? (
            <PaperTable papers={filteredPapers} />
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