import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/CategorySelect';

interface PaperFiltersProps {
  onAuthorSearch: (value: string) => void;
  onCategorySelect: (value: string) => void;
  onSearch: (query: string) => void;
  categories: string[];
}

const PaperFilters = ({ 
  onAuthorSearch, 
  onCategorySelect, 
  onSearch,
}: PaperFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');

  const handleAuthorSearch = (value: string) => {
    setAuthorSearch(value);
    onAuthorSearch(value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Papers</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="author-search">Filter by Author</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="author-search"
              placeholder="Author name..."
              value={authorSearch}
              onChange={(e) => handleAuthorSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2 w-[280px]">
          <Label htmlFor="category-select">Filter by Category</Label>
          <CategorySelect
            value=""
            onValueChange={onCategorySelect}
            placeholder="All Categories"
          />
        </div>
      </div>
    </div>
  );
};

export default PaperFilters;