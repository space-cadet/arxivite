import { Paper } from '@/types/paper';
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';
import PaperTable from './paper-table';
import { PaperCard } from './paper-card';

interface ResponsivePaperListProps {
  papers: Paper[];
}

export function ResponsivePaperList({ papers }: ResponsivePaperListProps) {
  const isMobile = useMediaQuery(breakpoints.ltMd);
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {papers.map(paper => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    );
  }
  
  return <PaperTable papers={papers} />;
}
