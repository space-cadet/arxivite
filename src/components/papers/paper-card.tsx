// Modified PaperCard component
import { Paper } from '@/types/paper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Download, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkContext } from '@/lib/bookmarks/context';

import { usePaperState, PaperStateHook } from '@/hooks/usePaperState';

interface PaperCardProps {
  paper: Paper;
  paperState: PaperStateHook;
}

export function PaperCard({ paper, paperState }: PaperCardProps) {
const { addBookmark, removeBookmark, loading, error, getBookmark } = useBookmarkContext();
  
  const isBookmarked = getBookmark(paper.id) !== undefined;
  const isExpanded = paperState.isExpanded(paper.id);
  
  const handleExpandClick = () => {
    paperState.toggleExpanded(paper.id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Bookmark click handler triggered');
    console.log('Current bookmark state:', isBookmarked);
    console.log('Paper ID:', paper.id);
    console.log('Paper data being bookmarked:', paper);
    
    if (isBookmarked) {
      console.log('Attempting to remove bookmark');
      removeBookmark(paper.id);
    } else {
      console.log('Attempting to add bookmark');
      addBookmark({
        paperId: paper.id,
        title: paper.title,
        category: paper.category,
        paperData: paper // Store the complete paper data
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const authors = paper.authors.length > 3 
    ? paper.authors.slice(0, 3).join(', ') + ' et al.'
    : paper.authors.join(', ');

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium leading-tight cursor-pointer" onClick={handleExpandClick}>
            <div className="flex items-start gap-2">
              <div className="pt-0.5">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <div>{paper.title}</div>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">{authors}</div>
          <div className="flex justify-between items-center">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {paper.category}
            </span>
            <span className="text-xs text-muted-foreground">{formatDate(paper.publishedDate)}</span>
          </div>
        </div>
      </CardContent>
      
      {isExpanded && (
        <CardContent className="border-t pt-3 text-sm">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Abstract</h4>
              <p className="mt-1 text-muted-foreground">
                {paper.abstract}
              </p>
            </div>
            <div className="flex flex-col gap-2">
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
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex items-center gap-2 pt-3 pb-3 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleBookmarkClick}
          disabled={loading}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="default" className="flex-1" asChild>
          <a href={`https://arxiv.org/abs/${paper.id}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View
          </a>
        </Button>
        <Button variant="default" size="default" className="flex-1" asChild>
          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
