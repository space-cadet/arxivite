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
      <SelectTrigger className="h-10 w-full">
        <SelectValue placeholder={placeholder}>
          {value === 'all' ? 'All Categories' : (value ? getCategoryById(value)?.name : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="w-full min-w-[280px]" sideOffset={4}>
        <ScrollArea className="h-72">
          <SelectItem value="all" className="py-2.5">All Categories</SelectItem>
          {mainSubjects.map((subject) => (
            <SelectGroup key={`group-${subject}`}>
              <SelectLabel className="py-1.5">{subject}</SelectLabel>
              {categoriesBySubject[subject].map((category) => (
                <SelectItem
                  key={`item-${category.id}`}
                  value={category.id}
                  title={category.description}
                  className="py-2"
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