import { useEffect } from "react"
import { useBookmarkContext } from "@/lib/bookmarks/context"
import { useProfile } from "@/hooks/useProfile"
import PaperFilters from "@/components/papers/paper-filters"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsivePaperList } from "@/components/papers/responsive-paper-list"
import { usePersistedState } from "@/hooks/usePersistedState"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getCategoryName } from "@/lib/categories"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useArxivSearch } from "@/hooks/useArxiv"
import { arxivToPaper } from "@/types/paper"
import type { ArxivPaper } from "@/types/arxiv"

export default function BookmarksPage() {
  const { profile } = useProfile();
  const context = useBookmarkContext();
  const { getAllBookmarks } = context;
  const [authorFilter, setAuthorFilter] = usePersistedState<string>("bookmarks.authorFilter", "")
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>("bookmarks.category", "all")
  
  // Get all bookmarked papers
  const bookmarks = getAllBookmarks();
  const paperIds = bookmarks
    .filter(bookmark => !bookmark.paperData) // Only for bookmarks without paperData
    .map(bookmark => bookmark.paperId);
  
  // For bookmarks that don't have paperData yet, fetch from API
  const arxivSearch = useArxivSearch();
  
  // Construct the most compatible query for ArXiv API
  // ArXiv API works best with comma-separated IDs in a single id: parameter
  const arxivQuery = paperIds.length > 0 
    ? `id:${paperIds.join(',')}`
    : 'id:NONE'; // Use a query that returns no results when no bookmarks
  
  console.log('ArXiv query:', arxivQuery);
  
  const { data, isLoading, error } = paperIds.length > 0 
    ? arxivSearch.search({
        query: arxivQuery,
        maxResults: 100
      })
    : { data: { papers: [] }, isLoading: false, error: null } as const;
  
  // Debug API response
  console.log('API response data:', data?.papers?.length || 0, 'papers fetched');
  if (error) console.error('API error:', error);

  // Create a function to update older bookmarks with paper data
  const updateOldBookmarks = (fetchedPapers: ReadonlyArray<ArxivPaper>) => {
    if (fetchedPapers.length === 0) return;
    
    // Map the papers by ID for easier lookup
    const paperMap = Object.fromEntries(
      fetchedPapers.map(paper => [paper.id, arxivToPaper(paper)])
    );
    
    // Update each bookmark that doesn't have paperData
    bookmarks
      .filter(bookmark => !bookmark.paperData && paperMap[bookmark.paperId])
      .forEach(bookmark => {
        const paper = paperMap[bookmark.paperId];
        console.log(`Updating bookmark for paper: ${bookmark.paperId}`);
        context.addBookmark({
          paperId: bookmark.paperId,
          title: bookmark.title,
          category: bookmark.category,
          paperData: paper
        });
      });
  };
  
  // Migrate old bookmarks when data is loaded
  useEffect(() => {
    if (data?.papers) {
      updateOldBookmarks(data.papers);
    }
  }, [data?.papers]);
  
  // Process the fetched papers
  const arxivPapers = data?.papers || [];
  console.log('ArXiv papers fetched:', arxivPapers.length);
  
  // Convert ArXiv papers to our application's Paper type for display
  const convertedPapers = arxivPapers.map(arxivToPaper);
  console.log('Converted papers:', convertedPapers.length);
  
  // Combine stored paper data with fetched data
  const papers = [
    // Include paper data from bookmarks
    ...bookmarks
      .filter(bookmark => bookmark.paperData)
      .map(bookmark => bookmark.paperData),
    
    // Include data from API for older bookmarks
    ...convertedPapers
  ];
  
  // Debug the final papers list
  console.log('Papers for display:', papers.length);
  console.log('Paper IDs:', papers.map(p => p?.id || 'undefined').join(', '));
  
  console.log('Total bookmarks:', bookmarks.length);
  console.log('Bookmarks with paperData:', bookmarks.filter(b => b.paperData).length);
  console.log('Bookmarks without paperData:', paperIds.length);
  console.log('Final papers count:', papers.length);

  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter papers based on author and category
  const filteredPapers = papers.filter(paper => {
    const authorMatch = !authorFilter || 
      paper.authors.some((author: string) => 
        author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    
    const categoryMatch = selectedCategory === 'all' || 
      paper.categories.includes(selectedCategory);
    
    return authorMatch && categoryMatch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 w-full animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading bookmarked papers: {error instanceof Error ? (error as { message?: string }).message || 'Unknown error' : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Bookmarked Papers</h1>
      </div>

      <div className="w-full space-y-4">
        <PaperFilters 
          authorValue={authorFilter}
          categoryValue={selectedCategory}
          searchValue=""
          onSearch={() => {}}
          onAuthorSearch={handleAuthorSearch}
          onCategorySelect={handleCategorySelect}
          categories={profile.categories}
        />

        {/* Active Filters */}
        {(authorFilter || selectedCategory !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-1">
            {authorFilter && (
              <Badge 
                variant="secondary"
                className="flex items-center gap-1 py-1.5 px-3 text-sm"
              >
                Author: {authorFilter}
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => setAuthorFilter('')}
                />
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge 
                className="flex items-center gap-1 py-1.5 px-3 text-sm"
              >
                Category: {getCategoryName(selectedCategory)}
                <X 
                  className="h-3 w-3 cursor-pointer ml-1" 
                  onClick={() => setSelectedCategory('all')}
                />
              </Badge>
            )}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 w-full animate-pulse bg-muted" />
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error loading bookmarked papers: {typeof error === 'object' && error !== null ? String(error) : 'Unknown error'}
                </AlertDescription>
              </Alert>
            ) : filteredPapers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {bookmarks.length === 0 ? (
                    "No bookmarked papers found. Try bookmarking some papers first."
                  ) : (
                    "No papers match your current filters. Try adjusting your search criteria."
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <ResponsivePaperList papers={filteredPapers} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}