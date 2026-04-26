import { Link, useNavigate } from "react-router";
import type {
  ClientWithSale,
  Sale,
  SalesWithClient,
} from "../../../shared/api/types/sales";
import { useFetchSales } from "../../../shared/hooks/useFetchSales";
import { TableSkeleton } from "../../../shared/components/LoadingSkeleton";
import { salesStatusVariants } from "../../../styles/variants/transactionStatusVariants";
import SaleActionsMenu from "./SaleActionsMenu";
import Button from "../../ui/Button";

const thClasses =
  "text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider";
const tdClasses = "px-4 md:px-6 py-3 md:py-4";

interface SalesListProps {
  onEditSale: (sale: SalesWithClient) => void;
  onDeleteSale: (sale: SalesWithClient) => void;
}

export default function SalesList({
  onEditSale,
  onDeleteSale,
}: SalesListProps) {
  const { data: sales, isLoading } = useFetchSales(5);
  const navigate = useNavigate();

  const handleViewDetails = (saleWithClient: Sale, client: ClientWithSale) => {
    navigate(`/sales/${saleWithClient.id}`, {
      state: { saleWithClient, client },
    });
  };

  return (
    <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-base md:text-lg font-semibold">
          Recent Transactions
        </h2>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-175">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className={thClasses}>Client</th>
                <th className={thClasses}>Amount</th>
                <th className={thClasses}>Date</th>
                <th className={thClasses}>Status</th>
                <th className={thClasses}>Actions</th>
                <th className={thClasses}>Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales?.map((sale) => {
                const client = sale.clients;
                return (
                  <tr key={sale.id}>
                    <td className={tdClasses}>
                      <span className="text-link underline">
                        <Link
                          to={`/clients/${client.username}`}
                          state={{ client }}
                        >
                          {client.name}
                        </Link>
                      </span>
                    </td>
                    <td className={tdClasses}>
                      ${sale.amount.toLocaleString()}
                    </td>
                    <td className={tdClasses}>
                      {new Date(sale.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className={tdClasses}>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${salesStatusVariants[sale.status]},
                                            )}`}
                      >
                        {sale.status.toUpperCase()}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span>
                        <SaleActionsMenu
                          onEdit={() => onEditSale(sale)}
                          onDelete={() => onDeleteSale(sale)}
                        />
                      </span>
                    </td>
                    <td>
                      <span className={tdClasses}>
                        <Button
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(sale, client)}
                        >
                          {sale.status !== "pending"
                            ? "View Details"
                            : "Review Transaction"}
                        </Button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
