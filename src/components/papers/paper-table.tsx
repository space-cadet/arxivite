import { useMemo } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { usePaperState } from '@/hooks/usePaperState';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Paper } from '@/types/paper';
import { SortField, SortOrder } from '@/types/sorting';
import PaperTableRow from './paper-table-row';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PaperTableProps {
  papers: Paper[];
  paperState: ReturnType<typeof usePaperState>;
  tableId: string; // Unique identifier for persisting sort state
  defaultSort?: {
    field: SortField;
    order: SortOrder;
  };
  onSortChange?: (field: SortField, order: SortOrder) => void; // Optional callback for parent components
}

const PaperTable = ({ 
  papers, 
  paperState, 
  tableId,
  defaultSort = { field: 'submittedDate', order: 'descending' },
  onSortChange 
}: PaperTableProps) => {
  // Internal sorting state
  const [sortField, setSortField] = usePersistedState<SortField>(
    `${tableId}.sortField`, 
    defaultSort.field
  );
  const [sortOrder, setSortOrder] = usePersistedState<SortOrder>(
    `${tableId}.sortOrder`, 
    defaultSort.order
  );

  // Handle sorting
  const handleSort = (field: SortField) => {
    let newOrder: SortOrder = 'descending';
    if (field === sortField) {
      newOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
      setSortOrder(newOrder);
    } else {
      setSortField(field);
      setSortOrder(newOrder);
    }
    
    // Notify parent component if callback provided
    onSortChange?.(field, newOrder);
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ChevronDown className="h-4 w-4 text-muted-foreground/50" />;
    return sortOrder === 'ascending' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Sort papers
  const sortedPapers = useMemo(() => {
    return [...papers].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'authors':
          comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '');
          break;
        case 'categories':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'submittedDate':
          comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
          break;
        case 'lastUpdatedDate':
          comparison = new Date(a.updatedDate || a.publishedDate).getTime() - new Date(b.updatedDate || b.publishedDate).getTime();
          break;
        default:
          return 0;
      }
      return sortOrder === 'ascending' ? comparison : -comparison;
    });
  }, [papers, sortField, sortOrder]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[400px] pl-10 cursor-pointer"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-2">
                Title
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('authors')}
            >
              <div className="flex items-center gap-2">
                Authors
                <SortIcon field="authors" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('categories')}
            >
              <div className="flex items-center gap-2">
                Category
                <SortIcon field="categories" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('submittedDate')}
            >
              <div className="flex items-center gap-2">
                Date
                <SortIcon field="submittedDate" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPapers.map((paper) => (
            <PaperTableRow key={paper.id} paper={paper} paperState={paperState} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaperTable;