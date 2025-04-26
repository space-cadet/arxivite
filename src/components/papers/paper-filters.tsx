import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaperFiltersProps {
  onAuthorSearch: (value: string) => void;
  onCategorySelect: (value: string) => void;
  categories: string[];
}

const PaperFilters = ({ onAuthorSearch, onCategorySelect, categories }: PaperFiltersProps) => {
  const [authorSearch, setAuthorSearch] = useState('');

  const handleAuthorSearch = (value: string) => {
    setAuthorSearch(value);
    onAuthorSearch(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="author-search">Search by Author</Label>
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

      <div className="space-y-2">
        <Label htmlFor="category-select">Filter by Category</Label>
        <Select onValueChange={onCategorySelect}>
          <SelectTrigger id="category-select">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PaperFilters;