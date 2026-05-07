import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmHeading: string;
  confirmParagraph: string | React.ReactNode;
  confirmColor: string;
  confirmButtonText: string;
  loadingText: string;
}

const colorClasses: Record<
  string,
  { bgIcon: string; bg: string; fg: string; text: string; hover: string }
> = {
  red: {
    bgIcon: "bg-destructive/15",
    bg: "bg-destructive",
    fg: "text-destructive-foreground",
    text: "text-destructive",
    hover: "hover:bg-destructive/90",
  },
  yellow: {
    bgIcon: "bg-warning/15",
    bg: "bg-warning",
    fg: "text-warning-foreground",
    text: "text-warning",
    hover: "hover:bg-warning/90",
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
  loadingText,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md">
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
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 ${colorClasses[confirmColor].bg} ${colorClasses[confirmColor].fg} rounded-lg text-sm font-medium cursor-pointer ${colorClasses[confirmColor].hover} transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading ? loadingText : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
