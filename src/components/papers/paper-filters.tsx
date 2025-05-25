import React from 'react';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CategorySelect } from '@/components/ui/CategorySelect';
import { HistoryInput } from '@/components/ui/history-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaperFiltersProps {
  searchValue: string;
  authorValue: string;
  categoryValue: string;
  sortField: string;
  onAuthorSearch: (value: string) => void;
  onCategorySelect: (value: string) => void;
  onSearch: (query: string) => void;
  onSortChange: (value: string) => void;
  categories: string[];
}

const PaperFilters = ({ 
  searchValue,
  authorValue,
  categoryValue,
  sortField,
  onAuthorSearch, 
  onCategorySelect, 
  onSearch,
  onSortChange,
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
    <div className="space-y-4">
      {/* Search Row */}
      <div className="space-y-2">
        <Label htmlFor="search-input">Search Papers</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <HistoryInput
                id="search-input"
                placeholder="Search papers..."
                value={localSearchValue}
                onValueChange={setLocalSearchValue}
                onKeyDown={handleKeyPress}
                className="pl-8 w-full"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="shrink-0"
            >
              Search
            </Button>
          </div>
          
          <div className="w-full sm:w-[200px]">
            <Select value={sortField} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submittedDate">Submission Date</SelectItem>
                <SelectItem value="lastUpdatedDate">Last Updated</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="author-filter">Filter by Author</Label>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <HistoryInput
              id="author-filter"
              placeholder="Author name..."
              value={authorValue}
              onValueChange={onAuthorSearch}
              className="pl-8 w-full"
            />
          </div>
        </div>
        
        <div className="w-full sm:w-[280px] space-y-2">
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