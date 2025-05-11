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

export default function BookmarksPage() {
  const { profile } = useProfile();
  const { getAllBookmarks } = useBookmarkContext();
  const [authorFilter, setAuthorFilter] = usePersistedState<string>("bookmarks.authorFilter", "")
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>("bookmarks.category", "all")
  
  // Get all bookmarked papers
  const bookmarks = getAllBookmarks();
  const paperIds = bookmarks.map(b => b.paperId);
  
  // Fetch full paper details for bookmarked papers
  const arxivSearch = useArxivSearch();
  const { data, isLoading, error } = arxivSearch.search({
    query: paperIds.length > 0 
      ? paperIds.map(id => `id:${id}`).join('+OR+')
      : 'id:NONE', // Use a query that returns no results when no bookmarks
    maxResults: 100
  });

  // Convert ArxivPaper to Paper type for UI components
  const papers = (data?.papers || []).map(arxivToPaper);

  const handleAuthorSearch = (author: string) => {
    setAuthorFilter(author);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter papers based on author and category
  const filteredPapers = papers.filter(paper => {
    const authorMatch = !authorFilter || 
      paper.authors.some(author => 
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
          Failed to load bookmarked papers. Please try again later.
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
            {filteredPapers.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No bookmarked papers found. Try bookmarking some papers or adjusting your filters.
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