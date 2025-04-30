import { useState, KeyboardEvent, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { getCategoryById, getCategoryName } from '@/lib/categories';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useArxivSearch } from '@/hooks/useArxiv';
import { arxivToPaper } from '@/types/paper';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import PaperTable from "@/components/papers/paper-table";
import { usePersistedState } from '@/hooks/usePersistedState';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HistoryInput } from "@/components/ui/history-input";

const ProfilePage = () => {
  const { profile, addToProfile, removeFromProfile, resetProfile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    categories: '',
    authors: '',
    keywords: '',
    excludeTerms: ''
  });

  // Use usePersistedState for input value only, not profile sync
  const [authorName, setAuthorName] = usePersistedState('profile.authorName', '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = usePersistedState('profile.papersTableOpen', true);
  
  const arxivSearch = useArxivSearch();
  const { data: authorPapers, isLoading: isLoadingPapers, error: paperError } = arxivSearch.search({ 
    query: searchQuery,
    maxResults: 50
  });

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

  const validateTerm = (value: string, field: keyof typeof inputs): { isValid: boolean; message?: string } => {
    const trimmed = value.trim();
    
    if (field === 'authors') {
      if (trimmed.length < 2) {
        return { isValid: false, message: 'Author name must be at least 2 characters long' };
      }
      
      if (!/^[a-zA-Z\s-]+$/.test(trimmed)) {
        return { isValid: false, message: 'Author name can only contain letters, spaces, and hyphens' };
      }

      return { isValid: true };
    }
    
    // For keywords and excludeTerms
    if (trimmed.length < 2) {
      return { isValid: false, message: 'Term must be at least 2 characters long' };
    }
    
    if (/^\d+$/.test(trimmed)) {
      return { isValid: false, message: 'Term cannot be purely numeric' };
    }
    
    if (!/^[a-zA-Z0-9\s-]+$/.test(trimmed)) {
      return { isValid: false, message: 'Term can only contain letters, numbers, spaces, and hyphens' };
    }

    return { isValid: true };
  };

  const handleKeyPressForInputs = (
    e: KeyboardEvent<HTMLInputElement>, 
    field: keyof typeof inputs
  ) => {
    const value = inputs[field].trim();
    if (e.key === 'Enter' && value) {
      const validation = validateTerm(value, field);
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Invalid input",
          description: validation.message
        });
        return;
      }

      // Check if item already exists in profile
      if (!profile[field].includes(value)) {
        addToProfile(field, value);
      }
      setInputs(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <div className="space-y-6">
        {/* Author Publications Section - Moved to top */}
        <Card>
          <CardHeader>
            <CardTitle>Your Identity</CardTitle>
            <CardDescription>
              Enter your name as it appears on your arXiv papers to find your publications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
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
              <Button 
                variant="default"
                onClick={handleSearch}
                disabled={!authorName.trim()}
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

            {authorPapers?.papers && authorPapers.papers.length > 0 && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between py-2">
                  <p className="text-sm text-muted-foreground">
                    Found {authorPapers.papers.length} papers
                  </p>
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
                  <PaperTable papers={authorPapers.papers.map(arxivToPaper)} />
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
            ) : authorName && !authorPapers?.papers?.length && (
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
          <CardHeader>
            <CardTitle>Research Interests</CardTitle>
            <CardDescription>
              Manage your research interests to get personalized paper recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories Section */}
            <div className="space-y-2">
              <Label>ArXiv Categories</Label>
              <div className="flex flex-wrap gap-2">
                {profile.categories.map(categoryId => (
                  <Badge 
                    key={categoryId} 
                    className="flex items-center gap-1"
                    title={getCategoryById(categoryId)?.description}
                  >
                    {getCategoryName(categoryId)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromProfile('categories', categoryId)}
                    />
                  </Badge>
                ))}
              </div>
              <CategorySelect
                value={inputs.categories}
                onValueChange={(value: string) => {
                  if (!profile.categories.includes(value)) {
                    addToProfile('categories', value);
                  }
                  setInputs(prev => ({ ...prev, categories: '' }));
                }}
                placeholder="Select a category"
                categories={profile.categories}
              />
            </div>

            {/* Authors Section */}
            <div className="space-y-2">
              <Label>Followed Authors</Label>
              <div className="flex flex-wrap gap-2">
                {profile.authors.map(author => (
                  <Badge 
                    key={author} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {author}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromProfile('authors', author)}
                    />
                  </Badge>
                ))}
              </div>
              <HistoryInput 
                id="followed-authors"
                placeholder="Add an author and press Enter" 
                className="mt-2"
                value={inputs.authors}
                onValueChange={value => setInputs(prev => ({ ...prev, authors: value }))}
                onKeyDown={e => handleKeyPressForInputs(e as any, 'authors')}
              />
            </div>

            {/* Keywords Section */}
            <div className="space-y-2">
              <Label>Research Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {profile.keywords.map(keyword => (
                  <Badge 
                    key={keyword} 
                    variant="outline" 
                    className="flex items-center gap-1"
                  >
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromProfile('keywords', keyword)}
                    />
                  </Badge>
                ))}
              </div>
              <HistoryInput 
                id="research-keywords"
                placeholder="Add a keyword and press Enter" 
                className="mt-2"
                value={inputs.keywords}
                onValueChange={value => setInputs(prev => ({ ...prev, keywords: value }))}
                onKeyDown={e => handleKeyPressForInputs(e as any, 'keywords')}
              />
            </div>

            {/* Exclude Terms Section */}
            <div className="space-y-2">
              <Label>Exclude Terms</Label>
              <div className="flex flex-wrap gap-2">
                {profile.excludeTerms.map(term => (
                  <Badge 
                    key={term} 
                    variant="destructive" 
                    className="flex items-center gap-1"
                  >
                    {term}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromProfile('excludeTerms', term)}
                    />
                  </Badge>
                ))}
              </div>
              <HistoryInput 
                id="exclude-terms"
                placeholder="Add term to exclude and press Enter" 
                className="mt-2"
                value={inputs.excludeTerms}
                onValueChange={value => setInputs(prev => ({ ...prev, excludeTerms: value }))}
                onKeyDown={e => handleKeyPressForInputs(e as any, 'excludeTerms')}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={resetProfile}
              >
                Reset
              </Button>
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