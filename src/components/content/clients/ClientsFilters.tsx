import { memo } from "react";
import { Search } from "lucide-react";
import type { ClientStatus } from "../../../shared/api/types/clients";
import Input from "../../ui/Input";

interface ClientsFIltersProps {
  search: string;
  statusFilter: ClientStatus;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ClientsFilters = memo(function ClientsFilters({
  search,
  statusFilter,
  onSearch,
  onChangeStatus,
}: ClientsFIltersProps) {
  return (
    <div className="bg-background rounded-xl p-3 md:p-4 shadow-sm border border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={onSearch}
          className="pl-10 pr-4 py-2"
        />
      </div>
      <select
        value={statusFilter}
        className="px-3 md:px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-35"
        onChange={onChangeStatus}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
});

export default ClientsFilters;
