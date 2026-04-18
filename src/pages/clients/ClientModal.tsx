import { useActionState } from "react";
import { X } from "lucide-react";
import type { Client } from "../../shared/api/types/clients";
import {
  initialState,
  type AddClientFormState,
} from "../../shared/api/types/formState";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, "id">) => Promise<void>;
  mode: "add" | "edit";
  client?: Client;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  mode,
  client,
}: ClientModalProps) {
  const addClientAction = async (
    prevFormState: AddClientFormState,
    formData: FormData,
  ): Promise<AddClientFormState> => {
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const totalSpent = formData.get("totalSpent") as string;

    const payload: Omit<Client, "id"> = {
      username,
      name,
      email,
      totalSpent: totalSpent ? parseFloat(totalSpent) : 0,
      status: mode === "add" ? ("active" as const) : client!.status,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    try {
      onSave(payload);
      onClose();

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const [formState, formAction] = useActionState(addClientAction, initialState);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-lg md:text-xl font-bold">
            {mode === "add" ? "Add New Client" : "Edit Client"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form className="p-4 md:p-6 space-y-4" action={formAction}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter client username"
              defaultValue={client?.username}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter client name"
              defaultValue={client?.name}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="client@example.com"
              defaultValue={client?.email}
            />
          </div>

          <div>
            <label
              htmlFor="totalSpent"
              className="block text-sm font-medium mb-2"
            >
              Total Spent ($)
            </label>
            <input
              type="number"
              id="totalSpent"
              name="totalSpent"
              min="0"
              step="0.001"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0.000"
              defaultValue={client?.totalSpent}
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
              {mode === "add" ? "Add Client" : "Save Changes"}
            </button>
          </div>
          {formState.error && (
            <p style={{ color: "red" }}>❌ {formState.error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
