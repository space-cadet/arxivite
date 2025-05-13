import { useState, KeyboardEvent, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, RefreshCcw, Settings } from 'lucide-react';
import { NavigationLink } from "@/components/ui/navigation-link";
import { useProfile } from '@/contexts/ProfileContext';
import { getCategoryById, getCategoryName } from '@/lib/categories';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useArxivSearch } from '@/hooks/useArxiv';
import { arxivToPaper, Paper } from '@/types/paper';
import { PaperCacheService } from '@/lib/papers/cache';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsivePaperList } from "@/components/papers/responsive-paper-list";
import { usePersistedState } from '@/hooks/usePersistedState';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryInput } from "@/components/ui/history-input";
import { usePaperState } from '@/hooks/usePaperState';

const ProfilePage = () => {
  const { profile, addToProfile, removeFromProfile, resetProfile, updateProfile } = useProfile();
  const { toast } = useToast();
  const paperState = usePaperState('profile-papers');
  // Use usePersistedState for input value only, not profile sync
  const [authorName, setAuthorName] = usePersistedState('profile.authorName', '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = usePersistedState('profile.papersTableOpen', true);
  
  const arxivSearch = useArxivSearch();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: authorPapers, isLoading: isLoadingPapers, error: paperError } = arxivSearch.search({ 
    query: searchQuery,
    maxResults: 50
  });

  // Load cached papers on mount
  useEffect(() => {
    const cachedData = PaperCacheService.get();
    if (cachedData) {
      setPapers(cachedData.papers);
    }
  }, []);

  // Update cache when new papers are fetched
  useEffect(() => {
    if (authorPapers?.papers) {
      const convertedPapers = authorPapers.papers.map(arxivToPaper);
      setPapers(convertedPapers);
      PaperCacheService.set(convertedPapers);
    }
  }, [authorPapers]);

  const handleRefresh = useCallback(async () => {
    if (!authorName.trim()) return;
    
    setIsRefreshing(true);
    PaperCacheService.clear();
    
    try {
      setSearchQuery(authorName ? `au:"${authorName}"` : '');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error refreshing papers",
        description: "There was a problem refreshing your papers. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [authorName, toast]);

  const handleSearch = () => {
    const name = authorName.trim();
    if (name.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Please enter your full name as it appears on arXiv papers"
      });
      return;
    }
    
    setSearchQuery(name ? `au:"${name}"` : '');
    
    // Only add to profile if searching
    if (!profile.authors.includes(name)) {
      addToProfile('authors', name);
    }
  };

  // Clean up fragmented author names on mount
  useEffect(() => {
    const authors = profile.authors;
    if (authors.length > 0) {
      // Find any single-letter or fragmented names
      const fragmentedNames = authors.filter(name => 
        name.length <= 2 || 
        authors.some(other => other !== name && other.includes(name))
      );
      
      if (fragmentedNames.length > 0) {
        // Remove fragmented names
        const cleanAuthors = authors.filter(name => !fragmentedNames.includes(name));
        updateProfile({
          ...profile,
          authors: cleanAuthors
        });
      }
    }
  }, []); // Run once on mount

=======

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <Toaster />
      <div className="space-y-6">
        {/* Author Publications Section - Moved to top */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Enter your name as it appears on your arXiv papers to find your publications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:flex-1">
                <HistoryInput
                  id="author-name"
                  placeholder="Enter your name as it appears on arXiv papers"
                  value={authorName}
                  onValueChange={setAuthorName}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="default"
                  onClick={handleSearch}
                  disabled={!authorName.trim()}
                  className="flex-1 sm:flex-none"
                >
                  Find Papers
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAuthorName('');
                    setSearchQuery('');
                  }}
                  disabled={!authorName}
                >
                  Clear
                </Button>
              </div>
            </div>

            {papers.length > 0 && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Found {papers.length} papers
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing || !authorName.trim()}
                      className="h-8 px-2"
                    >
                      <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Refresh papers</span>
                    </Button>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">Toggle papers</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <ResponsivePaperList 
                    papers={papers}
                    paperState={paperState}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}

            {isLoadingPapers ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : paperError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading papers: {paperError.message}
                </AlertDescription>
              </Alert>
            ) : authorName && !papers.length && !isLoadingPapers && (
              <Alert>
                <AlertDescription>
                  No papers found for author "{authorName}". Make sure to enter your name exactly as it appears on your arXiv papers.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Research Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Research Interests</CardTitle>
              <CardDescription>
                Your research profile and interests
              </CardDescription>
            </div>
            <NavigationLink 
              to="/settings" 
              section="profile"
              className="text-muted-foreground"
            >
              Manage Settings
            </NavigationLink>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>ArXiv Categories</Label>
                <NavigationLink 
                  to="/settings" 
                  section="categories"
                  variant="link"
                  className="text-xs text-muted-foreground h-auto p-0"
                >
                  Edit Categories
                </NavigationLink>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.categories.map(categoryId => (
                  <Badge 
                    key={categoryId} 
                    className="flex items-center gap-1"
                    title={getCategoryById(categoryId)?.description}
                  >
                    {getCategoryName(categoryId)}
                  </Badge>
                ))}
                {profile.categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories selected. Add categories in settings.
                  </p>
                )}
              </div>
            </div>

            {/* Keywords Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Research Keywords</Label>
                <NavigationLink 
                  to="/settings" 
                  section="keywords"
                  variant="link"
                  className="text-xs text-muted-foreground h-auto p-0"
                >
                  Edit Keywords
                </NavigationLink>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.keywords.map(keyword => (
                  <Badge 
                    key={keyword} 
                    variant="outline"
                  >
                    {keyword}
                  </Badge>
                ))}
                {profile.keywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No keywords added. Add keywords in settings.
                  </p>
                )}
              </div>
            </div>

            {/* Exclude Terms Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Exclude Terms</Label>
                <NavigationLink 
                  to="/settings" 
                  section="exclude"
                  variant="link"
                  className="text-xs text-muted-foreground h-auto p-0"
                >
                  Edit Terms
                </NavigationLink>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.excludeTerms.map(term => (
                  <Badge 
                    key={term} 
                    variant="destructive"
                  >
                    {term}
                  </Badge>
                ))}
                {profile.excludeTerms.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No exclude terms added. Add terms in settings.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Primary Category</p>
                  <p className="text-2xl font-bold">
                    {profile.categories[0] ? getCategoryName(profile.categories[0]) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Papers</p>
                  <p className="text-2xl font-bold">{papers.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ML Profile Section - Initially Hidden */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle>ML-Enhanced Profile</CardTitle>
            <CardDescription>
              Enable machine learning to automatically enhance your research profile based on your interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;