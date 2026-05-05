import { useState } from "react";
import type {
  ClientWithSale,
  SalesWithClient,
} from "../shared/api/types/sales";
import { useAddOrEditSale } from "../shared/hooks/useAddOrEditSale";
import { addSale, editSale } from "../shared/api/salesApi";
import { useDeleteSale } from "../shared/hooks/useDeleteSale";
import { useToast } from "../shared/hooks/useToast";
import SaleModal from "../components/content/sales/SaleModal";
import SalesChart from "../components/content/sales/SalesChart";
import SalesHeader from "../components/content/sales/SalesHeader";
import SalesList from "../components/content/sales/SalesList";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function SalesPage() {
  // States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesWithClient | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mutates
  const { mutateAsync: addAsync } = useAddOrEditSale(addSale);
  const { mutateAsync: editsync } = useAddOrEditSale(editSale);
  const { mutateAsync: deleteAsync } = useDeleteSale();
  const { showToast } = useToast();

  const handleAddSale = async (saleData: any) => {
    await addAsync(saleData);
    showToast("Transaction added successfully", "success");
  };

  const handleEditSale = async (saleData: any) => {
    if (selectedSale) {
      const { id, ...rest } = saleData;
      await editsync({
        next: { id: selectedSale.id, ...rest },
        prev: selectedSale,
      });
      showToast("Transaction updated successfully", "success");
    }
  };

  const handleDeleteSale = async () => {
    if (selectedSale) {
      try {
        await deleteAsync({
          id: selectedSale.id,
          client_id: selectedSale.client_id,
        });
        showToast("Transaction deleted successfully", "success");
      } catch (err: any) {
        showToast(err.message || "Failed to delete transaction", "error");
      }
    }
  };

  const openEditModal = (sale: SalesWithClient) => {
    setSelectedSale(sale);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sale: SalesWithClient) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <SalesHeader onOpenModal={() => setIsAddModalOpen(true)} />
      <SalesChart />
      <SalesList onEditSale={openEditModal} onDeleteSale={openDeleteModal} />

      {/* Add Sale Modal */}
      <SaleModal
        isOpen={isAddModalOpen}
        mode="add"
        onSave={handleAddSale}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Sale Modal */}
      <SaleModal
        isOpen={isEditModalOpen}
        mode="edit"
        onSave={handleEditSale}
        onClose={() => setIsEditModalOpen(false)}
        sale={selectedSale || undefined}
        client={
          selectedSale
            ? ({
                id: selectedSale.client_id,
                name: selectedSale.clients.name,
                username: selectedSale.clients.username,
                email: selectedSale.clients.email,
                total_spent: selectedSale.clients.total_spent,
                joinedDate: selectedSale.clients.joinedDate,
              } as ClientWithSale)
            : undefined
        }
      />

      {/* Delete Sale Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSale}
        confirmHeading="Delete Transaction"
        confirmParagraph="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmColor="red"
        confirmButtonText="Delete"
        loadingText="Deleting..."
      />
    </div>
  );
}
