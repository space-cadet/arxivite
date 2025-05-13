import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { NavigationLink } from "@/components/ui/navigation-link";
import { useProfile } from '@/contexts/ProfileContext';
import { getCategoryById, getCategoryName } from '@/lib/categories';
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
import { usePaperState } from '@/hooks/usePaperState';

const ProfilePage = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const paperState = usePaperState('profile-papers');
  const [isOpen, setIsOpen] = usePersistedState('profile.papersTableOpen', true);
  
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Build search query from all author names
  const authorQuery = profile.authors.length > 0
    ? profile.authors.map(name => `au:"${name}"`).join(' OR ')
    : '';
  
  const { data: authorPapers, isLoading: isLoadingPapers, error: paperError } = useArxivSearch().search({ 
    query: authorQuery,
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

  const handleRefresh = async () => {
    if (profile.authors.length === 0) return;
    
    setIsRefreshing(true);
    PaperCacheService.clear();
    
    try {
      // Force a refetch by clearing the cache
      PaperCacheService.clear();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error refreshing papers",
        description: "There was a problem refreshing your papers. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
      <Toaster />
      <div className="space-y-6">
        {/* Author Publications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Publications</CardTitle>
            <CardDescription>
              Papers associated with your author names
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Author Names</Label>
              <NavigationLink 
                to="/settings" 
                section="profile"
                variant="link"
                className="text-xs text-muted-foreground h-auto p-0"
              >
                Edit Author Names
              </NavigationLink>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.authors.map(name => (
                <Badge 
                  key={name}
                  variant="secondary"
                >
                  {name}
                </Badge>
              ))}
              {profile.authors.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No author names added. Add your names in settings.
                </p>
              )}
            </div>

            {profile.authors.length > 0 && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing || profile.authors.length === 0}
                  className="h-10 w-10"
                >
                  <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Refresh papers</span>
                </Button>
              </div>
            )}

            {papers.length > 0 && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Found {papers.length} papers
                    </p>
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
            ) : profile.authors.length > 0 && !papers.length && !isLoadingPapers && (
              <Alert>
                <AlertDescription>
                  No papers found for your author names. Make sure your names are entered exactly as they appear on your arXiv papers.
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
                    variant="secondary"
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