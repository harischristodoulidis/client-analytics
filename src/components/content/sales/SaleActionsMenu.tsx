import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SaleActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function SaleActionsMenu({
  onEdit,
  onDelete,
}: SaleActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-full -bottom-1/2 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-1000 py-1">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
