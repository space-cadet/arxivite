import { Paper } from '@/types/paper';
import { usePaperState } from '@/hooks/usePaperState';
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';
import PaperTable from './paper-table';
import { PaperCard } from './paper-card';
import { SortField, SortOrder } from '@/types/sorting';

interface ResponsivePaperListProps {
  papers: Paper[];
  paperState: ReturnType<typeof usePaperState>;
  tableId: string;
  defaultSort?: {
    field: SortField;
    order: SortOrder;
  };
  onSortChange?: (field: SortField, order: SortOrder) => void;
}

export function ResponsivePaperList({ 
  papers, 
  paperState,
  tableId,
  defaultSort,
  onSortChange
}: ResponsivePaperListProps) {
  const isMobile = useMediaQuery(breakpoints.ltMd);
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {papers.map(paper => (
          <PaperCard key={paper.id} paper={paper} paperState={paperState} />
        ))}
      </div>
    );
  }
  
  return (
    <PaperTable 
      papers={papers} 
      paperState={paperState}
      tableId={tableId}
      defaultSort={defaultSort}
      onSortChange={onSortChange}
    />
  );
}