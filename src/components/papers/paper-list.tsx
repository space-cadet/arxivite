import { Paper } from '@/types/paper';
import { PaperCard } from './paper-card';

import { PaperStateHook } from '@/hooks/usePaperState';

interface PaperListProps {
  papers: Paper[];
  paperState: PaperStateHook;
}

const PaperList = ({ papers, paperState }: PaperListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} paperState={paperState} />
      ))}
    </div>
  );
};

export default PaperList;