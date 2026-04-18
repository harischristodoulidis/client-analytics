import { Link } from "react-router";
import type { Client } from "../../shared/api/types/clients";
import { statusVariants } from "../../styles/variants/statusVariants";
import ActionsMenu from "./ActionsMenu";

type SortColumn = keyof Client;

interface ClientsListProps {
  clients: Client[];
  onSort: (column: SortColumn) => void;
  onRenderSortIcon: (column: SortColumn) => React.ReactNode;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

export default function ClientsList({
  clients,
  onSort,
  onRenderSortIcon,
  onEditClient,
  onDeleteClient,
}: ClientsListProps) {
  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <table className="w-full min-w-175">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              #
            </th>
            <th
              className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort("username")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Username</span>
                {onRenderSortIcon("username")}
              </div>
            </th>
            <th
              className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Name</span>
                {onRenderSortIcon("name")}
              </div>
            </th>
            <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th
              className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort("totalSpent")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Expenses</span>
                {onRenderSortIcon("totalSpent")}
              </div>
            </th>
            <th className="text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients?.map((client, index) => (
            <tr key={client.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 md:px-6 py-3 md:py-4">{index + 1}</td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-blue-800 underline">
                <Link to={client.username} state={{ client }}>
                  <div className="font-medium text-sm">{client.username}</div>
                </Link>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4">
                <div className="font-medium text-sm">{client.name}</div>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusVariants[client.status]},
                        )}`}
                >
                  {client.status}
                </span>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-sm">
                ${client.totalSpent.toLocaleString()}
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4">
                <ActionsMenu
                  onEdit={() => onEditClient(client)}
                  onDelete={() => onDeleteClient(client)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
