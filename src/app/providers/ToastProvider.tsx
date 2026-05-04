import { useRef, useState } from "react";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { ToastContext } from "./toastContext";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    id: number;
  } | null>(null);
  const toastIdRef = useRef(0);

  const showToast = (message: string, type: ToastType) => {
    toastIdRef.current += 1;
    setToast({ message, type, id: toastIdRef.current });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible
          onDismiss={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}
