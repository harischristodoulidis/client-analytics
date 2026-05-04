import { createContext } from "react";
import type { ToastType } from "../../components/ui/Toast";

export type ToastContextValue = {
  showToast: (message: string, type: ToastType) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
