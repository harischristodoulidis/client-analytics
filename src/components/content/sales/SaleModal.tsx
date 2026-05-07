import React, { useEffect, useState } from "react";
import { useGetClientByName } from "../../../shared/hooks/useGetClientByName";
import Modal from "../../ui/Modal";
import useDebounse from "../../../shared/hooks/useDebounce";
import Input from "../../ui/Input";
import Dropdown from "../../ui/Dropdown";
import type { Client } from "../../../shared/api/types/clients";
import type {
  ClientWithSale,
  Sale,
  SaleStatus,
} from "../../../shared/api/types/sales";

interface Payload {
  client_id: string;
  amount: number;
  status: SaleStatus;
  date: string;
  edited_at: string;
}

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Payload) => Promise<void>;
  mode: "add" | "edit";
  sale?: Sale;
  client?: ClientWithSale;
}

export default function SaleModal({
  isOpen,
  onClose,
  onSave,
  mode,
  sale,
  client,
}: SaleModalProps) {
  // States
  const [searchClient, setSearchClient] = useState(""); // display value only
  const [searchQuery, setSearchQuery] = useState(""); // drives API call
  const [clientId, setClientId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Custom hooks
  const debouncedSearch = useDebounse(searchQuery, 500);
  const { data: clients, isLoading: clientsLoading } = useGetClientByName({
    search: debouncedSearch,
  });

  useEffect(() => {
    if (sale && client && mode === "edit") {
      setClientId(sale.client_id);
      setAmount(sale.amount);
      setSearchClient(`${client.name} (${client.username})`);
    }
  }, [sale, mode, isOpen, client]);

  const labelClasses = "block text-sm font-medium mb-2";
  const inputClasses = "px-3 py-2";

  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchClient(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
  };

  const handeleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientId) {
      setError("There is no client found with the given name or username");
      return;
    }
    if (!amount) {
      setError("Transaction account must me > 0");
      return;
    }
    try {
      await onSave({
        client_id: clientId,
        amount: amount,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        edited_at: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
      return;
    }

    setSearchClient("");
    setSearchQuery("");
    setClientId(null);
    setAmount(null);
    onClose();
  };

  const selectClientContent = (clients: Client[]) => {
    if (clients.length === 0) {
      return null;
    }

    return (
      <Dropdown
        value={clientId ?? ""}
        onChange={setClientId}
        placeholder="Select a client..."
        className="w-full"
        options={clients.map((c) => ({
          value: c.id,
          label: `${c.name} (${c.username})`,
        }))}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Transaction" : "Edit Transaction"}
    >
      <form className="p-4 md:p-6 space-y-4" onSubmit={handeleSubmit}>
        <div>
          <label htmlFor="clientName" className={labelClasses}>
            Client <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            required
            className={inputClasses}
            placeholder="Enter client name or username"
            value={searchClient}
            onChange={handleClientSearch}
          />
          {clientsLoading && <p>Loading clients...</p>}
          {searchClient && searchQuery && clients && (
            <div className="mt-2">{selectClientContent(clients)}</div>
          )}
        </div>
        <div>
          <label htmlFor="clientName" className={labelClasses}>
            Amount <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            value={amount ?? 0}
            className={inputClasses}
            placeholder="0.00"
            onChange={handleChangeAmount}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {mode === "add" ? "Add Transaction" : "Save Changes"}
          </button>
        </div>
        {error && <p className="text-destructive">❌ {error}</p>}
      </form>
    </Modal>
  );
}
