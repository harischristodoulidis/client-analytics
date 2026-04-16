import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from "lucide-react";
import ClientsHeader from "./ClientsHeader";
import ClientsFilters from "./ClientsFilters";
import ClientsPagination from "./ClientsPagination";
import ClientsList from "./ClientsList";
import { useClients } from "../../shared/hooks/useClients";
import useDebounse from "../../shared/hooks/useDebounce";
import EmptyState from "../../shared/components/EmptyState";
import { TableSkeleton } from "../../shared/components/LoadingSkeleton";
import type { Client, ClientStatus } from "../../shared/api/types/clients";

const PAGE_SIZE = 10;
type SortDirection = "asc" | "desc";
type SortColumn = keyof Client;

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus>("active");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "asc",
  );
  const [sortColumn, setSortColumn] = useState<SortColumn>("id");

  const debouncedSearch = useDebounse(search, 500);

  const { data, isLoading } = useClients({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortColumn,
    order: sortDirection,
  });

  const clients = data?.data ?? [];
  const totalPages = data?.total_pages ?? 0;
  const startIndex = data?.start ?? 0;
  const endIndex = data?.end ?? 0;

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
    ) : (
      <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
    );
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleStatusFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as ClientStatus);
    },
    [],
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <ClientsHeader />
      <ClientsFilters
        search={search}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onChangeStatus={handleStatusFilter}
      />

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : clients.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <ClientsList
            clients={clients}
            onSort={handleSort}
            onRenderSortIcon={renderSortIcon}
          />

          {/* Pagination */}
          {totalPages && totalPages > 1 && (
            <ClientsPagination
              startIndex={startIndex}
              endIndex={endIndex}
              currentPage={page}
              total={data?.total}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-border">
          <EmptyState
            message="No clients found"
            icon={<Users className="w-12 h-12" />}
          />
        </div>
      )}
    </div>
  );
}
