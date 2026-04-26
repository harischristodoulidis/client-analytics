import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGetClientByName } from "../../../shared/hooks/useGetClientByName";
import useDebounse from "../../../shared/hooks/useDebounce";
import Input from "../../ui/Input";
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
  const [searchClient, setSearchClient] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Custom hooks
  const debouncedSearch = useDebounse(searchClient, 500);
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
  };

  const handleSelectClient = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setClientId(value);
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
    await onSave({
      client_id: clientId,
      amount: amount,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    });
    setSearchClient("");
    setClientId(null);
    setAmount(null);
    onClose();
  };

  if (!isOpen) return null;

  const selectClientContent = (clients: Client[]) => {
    if (clients.length === 0) {
      return null;
    }

    return (
      <select
        id="client"
        onChange={handleSelectClient}
        className="w-full border border-border rounded-lg bg-background text-foreground px-3 py-2"
      >
        <option value="">Select a client...</option>
        {clients?.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} ({client.username})
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-lg md:text-xl font-bold">
            {mode === "add" ? "Add New Transaction" : "Edit Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form className="p-4 md:p-6 space-y-4" onSubmit={handeleSubmit}>
          <div>
            <label htmlFor="clientName" className={labelClasses}>
              Client <span className="text-red-500">*</span>
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
            {searchClient && clients && (
              <div className="mt-2">{selectClientContent(clients)}</div>
            )}
          </div>
          <div>
            <label htmlFor="clientName" className={labelClasses}>
              Amount <span className="text-red-500">*</span>
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
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {mode === "add" ? "Add Transaction" : "Save Changes"}
            </button>
          </div>
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </form>
      </div>
    </div>
  );
}
