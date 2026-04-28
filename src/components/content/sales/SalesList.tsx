import { useEffect, useRef, useState } from "react";
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
import LoadMore from "./LoadMore";

const thClasses =
  "text-left px-4 md:px-6 py-2 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider";
const tdClasses = "px-4 md:px-6 py-3 md:py-4";

interface SalesListProps {
  onEditSale: (sale: SalesWithClient) => void;
  onDeleteSale: (sale: SalesWithClient) => void;
}

const STEP = 5;

export default function SalesList({
  onEditSale,
  onDeleteSale,
}: SalesListProps) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(false);

  const { data: sales, isLoading } = useFetchSales(STEP + 1, offset);
  const navigate = useNavigate();

  const visibleSales = sales?.slice(0, STEP);
  const hasMore = (sales?.length ?? 0) > STEP;
  const hasPrev = offset > 0;

  const changePage = (direction: 1 | -1) => {
    if (cooldownRef.current) return;
    if (direction === 1 && !hasMore) return;
    if (direction === -1 && !hasPrev) return;

    cooldownRef.current = true;
    setOffset((prev) => prev + direction * STEP);

    setTimeout(() => {
      cooldownRef.current = false;
    }, 600);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (cooldownRef.current) return;
      if (e.deltaY > 0 && hasMore) {
        e.preventDefault();
        changePage(1);
      } else if (e.deltaY < 0 && hasPrev) {
        e.preventDefault();
        changePage(-1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [hasMore, hasPrev]);

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
        <div ref={containerRef} className="overflow-x-auto -mx-4 md:mx-0">
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
              {hasPrev && (
                <LoadMore
                  direction="up"
                  onClick={() => changePage(-1)}
                  onGoToTop={() => setOffset(0)}
                />
              )}
              {visibleSales?.map((sale) => {
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
                            : "Review"}
                        </Button>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {hasMore && (
                <LoadMore direction="down" onClick={() => changePage(1)} />
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
