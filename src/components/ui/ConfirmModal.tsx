import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmHeading: string;
  confirmParagraph: string | React.ReactNode;
  confirmColor: string;
  confirmButtonText: string;
}

const colorClasses: Record<
  string,
  { bgIcon: string; bg: string; text: string; hover: string }
> = {
  red: {
    bgIcon: "bg-red-100",
    bg: "bg-red-800",
    text: "text-red-700",
    hover: "hover:bg-red-700",
  },
  yellow: {
    bgIcon: "bg-yellow-100",
    bg: "bg-yellow-800",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-700",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  confirmHeading,
  confirmParagraph,
  confirmColor,
  confirmButtonText,
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
            <div
              className={`shrink-0 w-12 h-12 rounded-full ${colorClasses[confirmColor].bgIcon} flex items-center justify-center`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${colorClasses[confirmColor].text}`}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{confirmHeading}</h3>
              <p className="text-sm text-muted-foreground">
                {confirmParagraph}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 ${colorClasses[confirmColor].bg} text-white rounded-lg text-sm font-medium cursor-pointer ${colorClasses[confirmColor].hover} transition-colors`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
