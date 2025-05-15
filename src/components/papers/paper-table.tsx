import { usePersistedState } from '@/hooks/usePersistedState';
import { usePaperState } from '@/hooks/usePaperState';
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
  paperState: ReturnType<typeof usePaperState>;
  onSort: (field: 'submittedDate' | 'lastUpdatedDate' | 'relevance') => void;
  sortField: 'submittedDate' | 'lastUpdatedDate' | 'relevance';
  sortOrder: 'ascending' | 'descending';
}

const PaperTable = ({ papers, paperState, onSort, sortField, sortOrder }: PaperTableProps) => {
  const SortIcon = ({ field }: { field: 'submittedDate' | 'lastUpdatedDate' | 'relevance' }) => {
    if (field !== sortField) return <ChevronDown className="h-4 w-4 text-muted-foreground/50" />;
    return sortOrder === 'ascending' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px] pl-10">Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Category</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('submittedDate')}
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
          {papers.map((paper) => (
            <PaperTableRow key={paper.id} paper={paper} paperState={paperState} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaperTable;