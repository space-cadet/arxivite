import { Calendar, Download, ExternalLink } from 'lucide-react';
import { Paper } from '@/types/paper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PaperCardProps {
  paper: Paper;
}

const PaperCard = ({ paper }: PaperCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="flex-1 text-lg font-semibold leading-tight">
            {paper.title}
          </CardTitle>
        </div>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          {paper.publishedDate}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-2 text-sm font-medium">
          {paper.authors.join(', ')}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.summary}
        </p>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {paper.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 h-3 w-3" />
          View
        </Button>
        <Button variant="default" size="sm">
          <Download className="mr-2 h-3 w-3" />
          PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaperCard;