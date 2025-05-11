import { Paper } from '@/types/paper';
import { PaperCard } from './paper-card';

interface PaperListProps {
  papers: Paper[];
}

const PaperList = ({ papers }: PaperListProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
};

export default PaperList;