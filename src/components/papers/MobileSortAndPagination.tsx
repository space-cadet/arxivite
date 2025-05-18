import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface MobileSortAndPaginationProps {
  currentPage: number;
  totalPages: number;
  sortField: 'date' | 'title';
  sortAscending: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (field: 'date' | 'title', ascending: boolean) => void;
  isLoading?: boolean;
}

export function MobileSortAndPagination({
  currentPage,
  totalPages,
  sortField,
  sortAscending,
  onPageChange,
  onSortChange,
  isLoading
}: MobileSortAndPaginationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[200px]">
          <SheetHeader>
            <SheetTitle>Sort Papers</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant={sortField === 'date' ? 'default' : 'outline'}
              onClick={() => {
                onSortChange('date', sortField === 'date' ? !sortAscending : false);
                setIsOpen(false);
              }}
            >
              Date {sortField === 'date' && (sortAscending ? '(Oldest)' : '(Newest)')}
            </Button>
            <Button
              variant={sortField === 'title' ? 'default' : 'outline'}
              onClick={() => {
                onSortChange('title', sortField === 'title' ? !sortAscending : true);
                setIsOpen(false);
              }}
            >
              Title {sortField === 'title' && (sortAscending ? '(A-Z)' : '(Z-A)')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}