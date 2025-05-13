
import { ChevronDown, ChevronUp, Download, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { Paper } from '@/types/paper';
import { PaperStateHook } from '@/hooks/usePaperState';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useBookmarkContext } from '@/lib/bookmarks/context';

interface PaperTableRowProps {
  paper: Paper;
  paperState: PaperStateHook;
}

const PaperTableRow = ({ paper, paperState }: PaperTableRowProps) => {
  const isOpen = paperState.isExpanded(paper.id);
  const { addBookmark, removeBookmark, loading, error, getBookmark } = useBookmarkContext();
  
  const isBookmarked = getBookmark(paper.id) !== undefined;
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(paper.id);
    } else {
      addBookmark({
        paperId: paper.id,
        title: paper.title,
        category: paper.category,
        paperData: paper
      });
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown date';
    
    try {
      // If it's a string, convert to a Date object
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return 'Invalid date';
    }
  };

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => paperState.toggleExpanded(paper.id)}
      >
        <TableCell className="font-medium w-[400px]">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={handleBookmarkClick}
              disabled={loading}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
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
        <TableCell>{formatDate(paper.publishedDate)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
            <Button 
              variant="outline" 
              size="default"
              className="hidden sm:flex md:hidden lg:flex"
              asChild
            >
              <a href={`https://arxiv.org/abs/${paper.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="flex sm:hidden md:flex lg:hidden"
              asChild
            >
              <a href={`https://arxiv.org/abs/${paper.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button 
              variant="default" 
              size="default"
              className="hidden sm:flex md:hidden lg:flex"
              asChild
            >
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </a>
            </Button>
            <Button 
              variant="default" 
              size="icon"
              className="flex sm:hidden md:flex lg:hidden"
              asChild
            >
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
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
                    {paper.abstract}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Published:</span>{' '}
                    {formatDate(paper.publishedDate)}
                  </div>
                  {paper.updatedDate && paper.publishedDate && 
                   new Date(paper.updatedDate).getTime() !== new Date(paper.publishedDate).getTime() && (
                    <div>
                      <span className="font-semibold">Last Updated:</span>{' '}
                      {formatDate(paper.updatedDate)}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">arXiv ID:</span>{' '}
                    {paper.id}
                  </div>
                  {paper.doi && (
                    <div>
                      <span className="font-semibold">DOI:</span>{' '}
                      {paper.doi}
                    </div>
                  )}
                  {paper.journalRef && (
                    <div>
                      <span className="font-semibold">Journal Ref:</span>{' '}
                      {paper.journalRef}
                    </div>
                  )}
                  {paper.comments && (
                    <div>
                      <span className="font-semibold">Comments:</span>{' '}
                      {paper.comments}
                    </div>
                  )}
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