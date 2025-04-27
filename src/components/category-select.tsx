// src/components/category-select.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ARXIV_CATEGORIES } from "@/config/arxiv-categories"

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function CategorySelect({ value, onValueChange, placeholder = "Select a category" }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ARXIV_CATEGORIES.map(category => (
            <SelectItem 
              key={category.id} 
              value={category.id}
              title={category.description}
            >
              {category.name} ({category.id})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}