import type { Client } from "../../../shared//api/types/clients";
import { statusVariants } from "../../../styles/variants/statusVariants";

interface ClientDetailsHeaderProps {
  username?: string;
  client: Client;
}

export default function ClientDetailsHeader({
  username,
  client,
}: ClientDetailsHeaderProps) {
  return (
    <div className="rounded-xl shadow-sm border border-border p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {client.name} ({username})
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-md ${statusVariants[client.status]}`}
            >
              {client.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
