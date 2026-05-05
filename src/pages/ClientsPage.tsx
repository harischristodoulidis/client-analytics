import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from "lucide-react";
import { addClient, editClient } from "../shared/api/clientsApi";
import { useClients } from "../shared/hooks/useClients";
import { useAddOrEditClient } from "../shared/hooks/useAddOrEditClient";
import useDebounse from "../shared/hooks/useDebounce";
import EmptyState from "../shared/components/EmptyState";
import { TableSkeleton } from "../shared/components/LoadingSkeleton";
import type { Client, ClientStatus } from "../shared/api/types/clients";
import ClientsHeader from "../components/content/clients/ClientsHeader";
import ClientsFilters from "../components/content/clients/ClientsFilters";
import ClientsPagination from "../components/content/clients/ClientsPagination";
import ClientsList from "../components/content/clients/ClientsList";
import ClientModal from "../components/content/clients/ClientModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useDeleteClient } from "../shared/hooks/useDeleteClient";
import { useToast } from "../shared/hooks/useToast";

const PAGE_SIZE = 10;
type SortDirection = "asc" | "desc";
type SortColumn = keyof Client;

export default function ClientsPage() {
  // States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus>("active");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "asc",
  );
  const [sortColumn, setSortColumn] = useState<SortColumn>("id");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Custom hooks
  const debouncedSearch = useDebounse(search, 500);
  const { data, isLoading } = useClients({
    page,
    page_size: PAGE_SIZE,
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortColumn,
    order: sortDirection,
  });
  const { mutateAsync: addAsync } = useAddOrEditClient(addClient);
  const { mutateAsync: editAsync } = useAddOrEditClient(editClient);
  const { mutateAsync: deleteAsync } = useDeleteClient();
  const { showToast } = useToast();

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

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value as ClientStatus);
  }, []);

  const handleAddClient = async (clientData: any) => {
    await addAsync(clientData);
    showToast("Client added successfully", "success");
  };

  const handleEditClient = async (clientData: any) => {
    if (selectedClient) {
      const { id, ...rest } = clientData;
      await editAsync({
        next: { id: selectedClient.id, ...rest },
        prev: selectedClient,
      });
      showToast("Client updated successfully", "success");
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        await deleteAsync({ id: selectedClient.id });
        showToast("Client deleted successfully", "success");
      } catch (err: any) {
        showToast(err.message || "Failed to delete client", "error");
      }
    }
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ClientsHeader onOpenModal={() => setIsAddModalOpen(true)} />
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
        <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
          <ClientsList
            clients={clients}
            onSort={handleSort}
            onRenderSortIcon={renderSortIcon}
            onEditClient={openEditModal}
            onDeleteClient={openDeleteModal}
          />
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
        <div className="bg-background rounded-xl shadow-sm border border-border">
          <EmptyState
            message="No clients found"
            icon={<Users className="w-12 h-12" />}
          />
        </div>
      )}

      {/* Add Client Modal */}
      <ClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddClient}
        mode="add"
      />

      {/* Edit Client Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditClient}
        mode="edit"
        client={selectedClient || undefined}
      />

      {/* Delete Client Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClient}
        confirmHeading="Delete Client"
        confirmParagraph={
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {selectedClient?.name}
            </span>
            ? This action cannot be undone.
          </p>
        }
        confirmColor="red"
        confirmButtonText="Delete"
        loadingText="Deleting..."
      />
    </div>
  );
}
