import { Link } from "react-router";
import type { Client } from "../../../shared/api/types/clients";
import { statusVariants } from "../../../styles/variants/statusVariants";
import ClientActionsMenu from "./ClientActionsMenu";

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
  const thClasses =
    "text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider";
  const thWithFilterClasses =
    "cursor-pointer hover:bg-muted/70 transition-colors";
  const tdClasses = "px-4 md:px-6 py-3 md:py-4";

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <table className="w-full min-w-175">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className={thClasses}>#</th>
            <th
              className={`${thClasses} ${thWithFilterClasses}`}
              onClick={() => onSort("username")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Username</span>
                {onRenderSortIcon("username")}
              </div>
            </th>
            <th
              className={`${thClasses} ${thWithFilterClasses}`}
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Name</span>
                {onRenderSortIcon("name")}
              </div>
            </th>
            <th className={thClasses}>Status</th>
            <th
              className={`${thClasses} ${thWithFilterClasses}`}
              onClick={() => onSort("totalSpent")}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span>Expenses</span>
                {onRenderSortIcon("totalSpent")}
              </div>
            </th>
            <th className={thClasses}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients?.map((client, index) => (
            <tr key={client.id} className="hover:bg-muted/30 transition-colors">
              <td className={tdClasses}>
                <span>{index + 1}</span>
              </td>
              <td className={`${tdClasses}`}>
                <span className="text-blue-800 underline">
                  <Link to={client.username} state={{ client }}>
                    <div className="font-medium text-sm">{client.username}</div>
                  </Link>
                </span>
              </td>
              <td className={tdClasses}>
                <span className="font-medium text-sm">{client.name}</span>
              </td>
              <td className={tdClasses}>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusVariants[client.status]},
                        )}`}
                >
                  {client.status}
                </span>
              </td>
              <td className={tdClasses}>
                <span className="font-medium text-sm">
                  ${client.totalSpent.toLocaleString()}
                </span>
              </td>
              <td className={tdClasses}>
                <span>
                  <ClientActionsMenu
                    onEdit={() => onEditClient(client)}
                    onDelete={() => onDeleteClient(client)}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
