import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthorNames from "@/components/profile/author-names";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, RefreshCcw } from 'lucide-react';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { HistoryInput } from "@/components/ui/history-input";
import { useProfile } from '@/contexts/ProfileContext';
import { getCategoryById, getCategoryName } from '@/lib/categories';
import { useToast } from "@/hooks/use-toast";
import { PaperCacheService } from "@/lib/papers/cache";
import { KeyboardEvent } from 'react';

export function ProfileSettings() {
  const { profile, addToProfile, removeFromProfile, resetProfile } = useProfile();
  const { toast } = useToast();
  
  const validateTerm = (value: string, field: 'authors' | 'keywords' | 'excludeTerms'): { isValid: boolean; message?: string } => {
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
    field: 'authors' | 'keywords' | 'excludeTerms',
    value: string
  ) => {
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
    }
  };

  const handleClearCache = () => {
    PaperCacheService.clear();
    toast({
      title: "Cache cleared",
      description: "Your paper cache has been cleared. The papers will be reloaded on your next profile visit."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your research profile settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Author Names Section */}
        <div className="space-y-2">
          <Label>Author Names</Label>
          <AuthorNames
            authorNames={profile.authors}
            onAddName={(name) => addToProfile('authors', name)}
            onRemoveName={(name) => removeFromProfile('authors', name)}
          />
        </div>

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
            value=""
            onValueChange={(value: string) => {
              if (!profile.categories.includes(value)) {
                addToProfile('categories', value);
              }
            }}
            placeholder="Select a category"
            categories={profile.categories}
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
            onKeyDown={e => handleKeyPressForInputs(e as any, 'keywords', (e.target as HTMLInputElement).value)}
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
            onKeyDown={e => handleKeyPressForInputs(e as any, 'excludeTerms', (e.target as HTMLInputElement).value)}
          />
        </div>

        {/* Cache Management */}
        <div className="space-y-2">
          <Label>Paper Cache</Label>
          <p className="text-sm text-muted-foreground">
            Clear the cached papers to force a refresh on your next profile visit
          </p>
          <Button 
            variant="outline"
            onClick={handleClearCache}
            className="w-full sm:w-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Clear Paper Cache
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={resetProfile}
          className="w-full sm:w-auto"
        >
          Reset All Settings
        </Button>
      </CardFooter>
    </Card>
  );
}