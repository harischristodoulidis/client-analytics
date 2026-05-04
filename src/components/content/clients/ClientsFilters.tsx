import { memo } from "react";
import { Search } from "lucide-react";
import type { ClientStatus } from "../../../shared/api/types/clients";
import Input from "../../ui/Input";
import Dropdown from "../../ui/Dropdown";

interface ClientsFIltersProps {
  search: string;
  statusFilter: ClientStatus;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStatus: (value: string) => void;
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
      <Dropdown
        value={statusFilter}
        onChange={onChangeStatus}
        className="min-w-35"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
        ]}
      />
    </div>
  );
});

export default ClientsFilters;
