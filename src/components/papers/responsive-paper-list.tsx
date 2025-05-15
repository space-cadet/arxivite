import { Paper } from '@/types/paper';
import { usePaperState } from '@/hooks/usePaperState';
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';
import PaperTable from './paper-table';
import { PaperCard } from './paper-card';

interface ResponsivePaperListProps {
  papers: Paper[];
  paperState: ReturnType<typeof usePaperState>;
  onSort: (field: 'submittedDate' | 'lastUpdatedDate' | 'relevance') => void;
  sortField: 'submittedDate' | 'lastUpdatedDate' | 'relevance';
  sortOrder: 'ascending' | 'descending';
}

export function ResponsivePaperList({ 
  papers, 
  paperState,
  onSort,
  sortField,
  sortOrder
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
  
  return <PaperTable 
    papers={papers} 
    paperState={paperState}
    onSort={onSort}
    sortField={sortField}
    sortOrder={sortOrder}
  />;
}
