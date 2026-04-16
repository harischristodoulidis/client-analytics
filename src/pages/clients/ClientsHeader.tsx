import { Plus } from "lucide-react";

export default function ClientsHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-xl md:text-2xl font-bold">Clients</h1>
      <button className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Client</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
}
