import { usePersistedState } from '@/hooks/usePersistedState';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Paper } from '@/types/paper';
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
}

type SortField = 'title' | 'authors' | 'category' | 'publishedDate';
type SortDirection = 'asc' | 'desc';

const PaperTable = ({ papers }: PaperTableProps) => {
  const [sortField, setSortField] = usePersistedState<SortField>('paperTable.sortField', 'publishedDate');
  const [sortDirection, setSortDirection] = usePersistedState<SortDirection>('paperTable.sortDirection', 'desc');

  const sortPapers = (papers: Paper[]): Paper[] => {
    return [...papers].sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case 'title':
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case 'authors':
          compareA = a.authors[0]?.toLowerCase() || '';
          compareB = b.authors[0]?.toLowerCase() || '';
          break;
        case 'category':
          compareA = a.category.toLowerCase();
          compareB = b.category.toLowerCase();
          break;
        case 'publishedDate':
          compareA = new Date(a.publishedDate).getTime();
          compareB = new Date(b.publishedDate).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ChevronDown className="h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[400px] cursor-pointer pl-10"
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
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center gap-2">
                Category
                <SortIcon field="category" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('publishedDate')}
            >
              <div className="flex items-center gap-2">
                Date
                <SortIcon field="publishedDate" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortPapers(papers).map((paper) => (
            <PaperTableRow key={paper.id} paper={paper} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaperTable;