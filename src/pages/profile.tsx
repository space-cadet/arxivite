import { useState, KeyboardEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { getCategoryById, getCategoryName } from '@/lib/categories';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ProfilePage = () => {
  const { profile, addToProfile, removeFromProfile, resetProfile } = useProfile();
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    categories: '',
    authors: '',
    keywords: '',
    excludeTerms: ''
  });

  const validateTerm = (value: string, field: 'keywords' | 'excludeTerms'): { isValid: boolean; message?: string } => {
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

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>, 
    field: keyof typeof inputs
  ) => {
    const value = inputs[field].trim();
    if (e.key === 'Enter' && value) {
      if (field === 'keywords' || field === 'excludeTerms') {
        const validation = validateTerm(value, field);
        if (!validation.isValid) {
          toast({
            variant: "destructive",
            title: "Invalid input",
            description: validation.message
          });
          return;
        }
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
        <Card>
          <CardHeader>
            <CardTitle>Research Profile</CardTitle>
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
              <Input 
                placeholder="Add an author and press Enter" 
                className="mt-2"
                value={inputs.authors}
                onChange={e => setInputs(prev => ({ ...prev, authors: e.target.value }))}
                onKeyPress={e => handleKeyPress(e, 'authors')}
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
              <Input 
                placeholder="Add a keyword and press Enter" 
                className="mt-2"
                value={inputs.keywords}
                onChange={e => setInputs(prev => ({ ...prev, keywords: e.target.value }))}
                onKeyPress={e => handleKeyPress(e, 'keywords')}
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
              <Input 
                placeholder="Add term to exclude and press Enter" 
                className="mt-2"
                value={inputs.excludeTerms}
                onChange={e => setInputs(prev => ({ ...prev, excludeTerms: e.target.value }))}
                onKeyPress={e => handleKeyPress(e, 'excludeTerms')}
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