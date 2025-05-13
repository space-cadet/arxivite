import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from "@/hooks/use-toast";
import AuthorNames from "@/components/profile/author-names";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { HistoryInput } from "@/components/ui/history-input";
import { CategorySelect } from '@/components/ui/CategorySelect';
import { getCategoryById, getCategoryName } from '@/lib/categories';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { KeyboardEvent, useState } from 'react';

export function ResearchInterestSettings() {
  const { profile, addToProfile, removeFromProfile, resetProfile } = useProfile();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    keywords: '',
    excludeTerms: ''
  });

  const validateTerm = (value: string): { isValid: boolean; message?: string } => {
    const trimmed = value.trim();
    
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

  const handleInputSubmit = (field: keyof typeof inputs, value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const validation = validateTerm(trimmedValue);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: validation.message
      });
      return;
    }

    if (!profile[field].includes(trimmedValue)) {
      addToProfile(field, trimmedValue);
    }
    setInputs(prev => ({ ...prev, [field]: '' }));
  };

  const handleKeyPressForInputs = (
    e: KeyboardEvent<HTMLInputElement>, 
    field: keyof typeof inputs
  ) => {
    if (e.key === 'Enter') {
      handleInputSubmit(field, inputs[field]);
    }
  };

  return (
    <Card id="research-interests">
      <CardHeader>
        <CardTitle>Research Interests</CardTitle>
        <CardDescription>
          Manage your research interests and preferences
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
          <div className="flex gap-2">
            <HistoryInput 
              id="research-keywords"
              placeholder="Add a keyword" 
              className="mt-2"
              value={inputs.keywords}
              onValueChange={value => setInputs(prev => ({ ...prev, keywords: value }))}
              onKeyDown={e => handleKeyPressForInputs(e as any, 'keywords')}
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => handleInputSubmit('keywords', inputs.keywords)}
              disabled={!inputs.keywords.trim()}
            >
              Add
            </Button>
          </div>
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
          <div className="flex gap-2">
            <HistoryInput 
              id="exclude-terms"
              placeholder="Add term to exclude" 
              className="mt-2"
              value={inputs.excludeTerms}
              onValueChange={value => setInputs(prev => ({ ...prev, excludeTerms: value }))}
              onKeyDown={e => handleKeyPressForInputs(e as any, 'excludeTerms')}
            />
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => handleInputSubmit('excludeTerms', inputs.excludeTerms)}
              disabled={!inputs.excludeTerms.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Reset All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Research Interests?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all your categories, keywords, and exclude terms. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetProfile}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}