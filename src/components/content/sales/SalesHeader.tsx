import { Plus } from "lucide-react";

interface SalesHeaderProps {
  onOpenModal: () => void;
}

export default function SalesHeader({ onOpenModal }: SalesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-xl md:text-2xl font-bold">Sales</h1>
      <button
        className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm"
        onClick={onOpenModal}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Transaction</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
}
