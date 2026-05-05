import { useState } from "react";
import {
  Calendar,
  User,
  CircleCheck,
  CircleX,
  SquircleDashed,
  BadgeDollarSign,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { editSale } from "../shared/api/salesApi";
import type { Sale, SaleStatus } from "../shared/api/types/sales";
import { useAddOrEditSale } from "../shared/hooks/useAddOrEditSale";
import DetailsCard from "../components/ui/DetailsCard";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function TransactionDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saleWithClient, client } = location.state || {};

  const [saleStatus, setStateStatus] = useState(saleWithClient.status);
  const [selectedSaleStatus, setSelectedStateStatus] = useState(
    saleWithClient.status,
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { mutateAsync: editAsync } = useAddOrEditSale(editSale);

  const labelClasses = "text-sm text-muted-foreground mb-1";

  const statusIconContent = () => {
    switch (saleStatus) {
      case "completed": {
        return <CircleCheck className="w-5 h-5 text-green-700" />;
      }
      case "pending": {
        return <SquircleDashed className="w-5 h-5 text-yellow-700" />;
      }
      case "failed": {
        return <CircleX className="w-5 h-5 text-red-700" />;
      }
    }
  };

  const handleSelectStatus = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = e.target.value as SaleStatus;

    if (value !== "pending") {
      setIsConfirmModalOpen(true);
    }
    setSelectedStateStatus(value);
  };

  const handleConfirmAction = async (saleData: Sale) => {
    const { client_id, amount, date } = saleData;
    const editData = {
      id: saleWithClient.id,
      client_id,
      amount,
      date,
      status: selectedSaleStatus,
    };
    try {
      await editAsync({ next: editData, prev: saleWithClient });
      setStateStatus(selectedSaleStatus);
    } catch (error) {
      throw error;
    }
    setSelectedStateStatus(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      >
        Go Back
      </button>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DetailsCard detailsContext="Transaction Information">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className={labelClasses}>Client</p>
              <Link
                to={`/clients/${client.username}`}
                state={{ client }}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {client.name} ({client.username})
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
              <BadgeDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={labelClasses}>Amount</p>
              <p className="text-sm font-medium">${saleWithClient.amount}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className={labelClasses}>Transaction Date</p>
              <p className="text-sm font-medium">
                {new Date(saleWithClient.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
              {statusIconContent()}
            </div>
            <div>
              <p className="text-sm font-medium">{saleStatus.toUpperCase()}</p>
            </div>
            {saleStatus === "pending" && (
              <select
                id="client"
                onChange={handleSelectStatus}
                className="max-w-full border border-border rounded-lg bg-background text-foreground px-3 py-2"
              >
                <option value="">Approve/Reject Transaction...</option>
                <option value="completed">Approve</option>
                <option value="failed">Reject</option>
                <option value="pending">Keep pending</option>
              </select>
            )}
          </div>
        </DetailsCard>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handleConfirmAction(saleWithClient)}
        confirmHeading={`${selectedSaleStatus === "completed" ? `Approve` : `Reject`} Transaction`}
        confirmParagraph={`Are you sure you want to ${selectedSaleStatus === "completed" ? `approve` : `reject`} this transaction?`}
        confirmColor="yellow"
        confirmButtonText="Done"
        loadingText={
          selectedSaleStatus === "completed" ? "Approving..." : "Rejecting..."
        }
      />
    </div>
  );
}
