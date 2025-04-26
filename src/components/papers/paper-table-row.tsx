import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, ExternalLink } from 'lucide-react';
import { Paper } from '@/types/paper';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface PaperTableRowProps {
  paper: Paper;
}

const PaperTableRow = ({ paper }: PaperTableRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="font-medium w-[400px]">
          <div className="flex items-center gap-2">
            {isOpen ? 
              <ChevronUp className="h-4 w-4 flex-shrink-0" /> : 
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            }
            {paper.title}
          </div>
        </TableCell>
        <TableCell>{paper.authors.join(', ')}</TableCell>
        <TableCell>
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {paper.category}
          </span>
        </TableCell>
        <TableCell>{paper.publishedDate}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-3 w-3" />
              View
            </Button>
            <Button variant="default" size="sm">
              <Download className="mr-2 h-3 w-3" />
              PDF
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={5} className="border-t-0 bg-muted/50">
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold">Abstract</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {paper.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Published:</span>{' '}
                    {paper.publishedDate}
                  </div>
                  {paper.updatedDate !== paper.publishedDate && (
                    <div>
                      <span className="font-semibold">Last Updated:</span>{' '}
                      {paper.updatedDate}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">arXiv ID:</span>{' '}
                    {paper.id}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default PaperTableRow;