import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
};

const BORDER_ACCENT: Record<ToastType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
};

export default function Toast({
  message,
  type,
  isVisible,
  onDismiss,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-200">
      <div
        className={`flex items-start gap-3 bg-background border border-border border-l-4 ${BORDER_ACCENT[type]} rounded-lg shadow-lg px-4 py-3 min-w-65 max-w-sm`}
      >
        {ICONS[type]}
        <p className="flex-1 text-sm leading-snug">{message}</p>
        <button
          onClick={onDismiss}
          className="mt-0.5 p-0.5 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
