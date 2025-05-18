import { useState, useMemo } from 'react';
import { Paper } from '@/types/paper';
import { usePaperState } from '@/hooks/usePaperState';
import { useMediaQuery, breakpoints } from '@/hooks/useMediaQuery';
import PaperTable from './paper-table';
import { PaperCard } from './paper-card';
import { PaginationControls } from './pagination-controls';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ResponsivePaperListProps {
  papers: Paper[];
  paperState: ReturnType<typeof usePaperState>;
  tableId: string;
  totalResults?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

export function ResponsivePaperList({ 
  papers, 
  paperState,
  tableId,
  totalResults,
  currentPage = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  isLoading
}: ResponsivePaperListProps) {
  const isMobile = useMediaQuery(breakpoints.ltMd);
  const [isOpen, setIsOpen] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'title'>('date');
  const [sortAscending, setSortAscending] = useState(false);

  const processedPapers = useMemo(() => {
    let sorted = [...papers].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.publishedDate || '').getTime();
        const dateB = new Date(b.publishedDate || '').getTime();
        return sortAscending ? dateA - dateB : dateB - dateA;
      }
      // Title sort
      return sortAscending 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    return sorted;
  }, [papers, sortField, sortAscending]);

  const renderContent = () => {
    if (isMobile) {
      return (
        <>
          <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-xl font-semibold">Papers</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(true)}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="bottom" className="h-[200px]">
              <SheetHeader>
                <SheetTitle>Sort Papers</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button
                  variant={sortField === 'date' ? 'default' : 'outline'}
                  onClick={() => {
                    setSortField('date');
                    setSortAscending(sortField === 'date' ? !sortAscending : false);
                    setIsOpen(false);
                  }}
                >
                  Date {sortField === 'date' && (sortAscending ? '(Oldest)' : '(Newest)')}
                </Button>
                <Button
                  variant={sortField === 'title' ? 'default' : 'outline'}
                  onClick={() => {
                    setSortField('title');
                    setSortAscending(sortField === 'title' ? !sortAscending : true);
                    setIsOpen(false);
                  }}
                >
                  Title {sortField === 'title' && (sortAscending ? '(A-Z)' : '(Z-A)')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="space-y-4">
            {processedPapers.map(paper => (
              <PaperCard key={paper.id} paper={paper} paperState={paperState} />
            ))}
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {Math.ceil((totalResults || 0) / pageSize)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={!totalResults || currentPage >= Math.ceil(totalResults / pageSize) - 1 || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {totalResults && totalResults > 0 && (
          <div className="mb-4">
            <PaginationControls
              currentPage={currentPage}
              pageSize={pageSize}
              totalResults={totalResults}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </div>
        )}
        <PaperTable 
          papers={processedPapers} 
          paperState={paperState}
          tableId={tableId}
          defaultSort={{
            field: sortField,
            order: sortAscending ? 'asc' : 'desc'
          }}
          onSortChange={(field, order) => {
            setSortField(field as 'date' | 'title');
            setSortAscending(order === 'asc');
          }}
        />
      </>
    );
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
}