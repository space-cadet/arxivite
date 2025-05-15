import React from 'react';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { HistoryInput } from '@/components/ui/history-input';

interface PaperFiltersProps {
  searchValue: string;
  authorValue: string;
  categoryValue: string;
  onAuthorSearch: (value: string) => void;
  onCategorySelect: (value: string) => void;
  onSearch: (query: string) => void;
  categories: string[];
}

const PaperFilters = ({ 
  searchValue,
  authorValue,
  categoryValue,
  onAuthorSearch, 
  onCategorySelect, 
  onSearch,
  categories
}: PaperFiltersProps) => {
  const [localSearchValue, setLocalSearchValue] = React.useState(searchValue);

  const handleSearch = () => {
    onSearch(localSearchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="search">Search Papers</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <HistoryInput
              id="paper-search"
              placeholder="Search papers..."
              value={localSearchValue}
              onValueChange={setLocalSearchValue}
              onKeyDown={handleKeyPress}
              className="pl-8 w-full"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="h-10 sm:w-auto w-full"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 w-full md:flex-1">
          <Label htmlFor="author-search">Filter by Author</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <HistoryInput
              id="author-filter"
              placeholder="Author name..."
              value={authorValue}
              onValueChange={onAuthorSearch}
              className="pl-8 w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2 w-full md:w-[280px]">
          <Label htmlFor="category-select">Filter by Category</Label>
          <CategorySelect
            value={categoryValue}
            onValueChange={onCategorySelect}
            placeholder="All Categories"
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
};

export default PaperFilters;