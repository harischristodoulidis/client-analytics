import { AlertTriangle } from "lucide-react";
import type { Client } from "../../shared/api/types/clients";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  client?: Client;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  client,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    try {
      onConfirm();
      onClose();
    } catch (err: any) {
      throw new Error("Something went wrong deleting the client");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Delete Client</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {client?.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
