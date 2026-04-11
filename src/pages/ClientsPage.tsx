import { useState, useMemo } from "react";
import {
  Plus,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { clients } from "../shared/api/mockData";

const PAGE_SIZE = 3;
type Status = "all" | "active" | "inactive" | "pending";
type SortDirection = "asc" | "desc";
type Client = {
  id: string;
  name: string;
  email: string;
  status: string;
  totalSpent: number;
  joinedDate: string;
};
type SortColumn = keyof Client;

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "asc",
  );
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredClientsByStatus = useMemo(() => {
    return clients.filter((client) => {
      switch (statusFilter) {
        case "active":
          return client.status === "active";
        case "inactive":
          return client.status === "inactive";
        case "pending":
          return client.status === "pending";
        default:
          return statusFilter;
      }
    });
  }, [statusFilter]);

  const filteredClients = useMemo(() => {
    return filteredClientsByStatus.filter((client) => {
      return Object.values(client).some((value) =>
        String(value).toLocaleLowerCase().includes(search.toLowerCase()),
      );
    });
  }, [filteredClientsByStatus, search, sortColumn, sortDirection]);

  // Sorting
  const sortedClients = useMemo(() => {
    const copyFiltered = [...filteredClients];
    if (sortColumn) {
      return copyFiltered.sort((a, b) => {
        let aValue: string | number = a[sortColumn];
        let bValue: string | number = b[sortColumn];

        if (sortColumn === "name" || sortColumn === "email") {
          aValue = (aValue as string).toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return copyFiltered;
  }, [sortColumn, filteredClients, sortDirection]);

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

  // Pagination
  const totalPages = Math.ceil(sortedClients.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const paginatedClients = useMemo(() => {
    return sortedClients?.slice(startIndex, endIndex);
  }, [filteredClients, page]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Clients</h1>
        <button className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Client</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status)}
          className="px-3 md:px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-175">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  #
                </th>
                <th
                  className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <span>Name</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <span>Email</span>
                    {renderSortIcon("email")}
                  </div>
                </th>
                <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("totalSpent")}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <span>Total Spent</span>
                    {renderSortIcon("totalSpent")}
                  </div>
                </th>
                <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedClients.map((client, index) => (
                <tr
                  key={client.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4">{index + 1}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="font-medium text-sm">{client.name}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">
                    {client.email}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                        client.status as Status,
                      )}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-sm">
                    ${client.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="text-xs md:text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredClients.length)} of{" "}
              {filteredClients.length} clients
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-lg text-xs md:text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                disabled={page === 1}
                onClick={() => setPage((prevPage) => prevPage - 1)}
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="text-xs md:text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <button
                className="px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-lg text-xs md:text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                disabled={page === totalPages}
                onClick={() => setPage((prevPage) => prevPage + 1)}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
