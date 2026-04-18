import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import ClientsPaginationButton from "./ClientsPaginationButton";

interface ClientsPaginationProps {
  startIndex: number;
  endIndex: number;
  currentPage: number;
  total?: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ClientsPagination({
  startIndex,
  endIndex,
  currentPage,
  total,
  totalPages,
  onPageChange,
}: ClientsPaginationProps) {
  return (
    <div className="border-t border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <div className="text-xs md:text-sm text-muted-foreground">
        Showing {startIndex + 1} to {endIndex + 1} of {total} clients
      </div>
      <div className="flex items-center gap-2">
        <ClientsPaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Go to Start</span>
        </ClientsPaginationButton>

        <ClientsPaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Previous</span>
        </ClientsPaginationButton>

        <div className="text-xs md:text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <ClientsPaginationButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </ClientsPaginationButton>

        <ClientsPaginationButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <span className="hidden sm:inline">Go to End</span>
          <ChevronsRight className="w-3 h-3 md:w-4 md:h-4" />
        </ClientsPaginationButton>
      </div>
    </div>
  );
}
