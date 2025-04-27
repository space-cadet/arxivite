import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCategoriesByMainSubject, getMainSubjects, getCategoryById } from "@/lib/categories"

interface CategorySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  categories: string[]
}

export function CategorySelect({ value, onValueChange, placeholder = "Select a category" }: CategorySelectProps) {
  const mainSubjects = getMainSubjects()
  const categoriesBySubject = getCategoriesByMainSubject()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {value ? getCategoryById(value)?.name : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-80">
          {mainSubjects.map((subject) => (
            <SelectGroup key={`group-${subject}`}>
              <SelectLabel>{subject}</SelectLabel>
              {categoriesBySubject[subject].map((category) => (
                <SelectItem
                  key={`item-${category.id}`}
                  value={category.id}
                  title={category.description}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}