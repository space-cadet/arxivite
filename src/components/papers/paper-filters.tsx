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
  const handleSearch = (value: string) => {
    onSearch(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Papers</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <HistoryInput
              id="paper-search"
              placeholder="Search papers..."
              value={searchValue}
              onValueChange={handleSearch}
              onKeyDown={handleKeyPress}
              className="pl-8"
            />
          </div>
          <Button onClick={() => handleSearch(searchValue)}>
            Search
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="author-search">Filter by Author</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <HistoryInput
              id="author-filter"
              placeholder="Author name..."
              value={authorValue}
              onValueChange={onAuthorSearch}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2 w-[280px]">
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