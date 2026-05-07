import { useState } from "react";
import { editClient } from "../../shared/api/clientsApi";
import type { Client, ClientStatus } from "../../shared/api/types/clients";
import { useAddOrEditSale } from "../../shared/hooks/useAddOrEditSale";
import { clientStatusVariants } from "../../styles/variants/clientStatusVariants";
import Button from "./Button";
import Dropdown from "./Dropdown";

interface ClientDetailsHeaderProps {
  username?: string;
  client: Client;
}

export default function ClientDetailsHeader({
  username,
  client,
}: ClientDetailsHeaderProps) {
  const [status, setStatus] = useState<ClientStatus>(client.status);
  const { mutateAsync: editAsync } = useAddOrEditSale(editClient);

  const handleChangeStatus = async (selected?: string) => {
    let newStatus: ClientStatus;
    switch (status) {
      case "active":
        newStatus = "inactive";
        break;
      case "inactive":
        newStatus = "active";
        break;
      case "pending":
        if (!selected || selected === status) return;
        newStatus = selected as ClientStatus;
        break;
      default:
        return;
    }
    setStatus(newStatus);

    const editData = {
      name: client.name,
      username: client.username,
      email: client.email,
      status: newStatus,
      total_spent: client.total_spent,
      joinedDate: client.joinedDate,
    };

    await editAsync({
      next: { id: client.id, ...editData },
      prev: client,
    });
  };

  return (
    <div className="rounded-xl shadow-sm border border-border p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {client.name} ({username})
          </h1>
          <div className="flex flex-col gap-2 max-w-fit max-h-fit">
            <div
              className={`px-3 py-1 text-sm font-medium text-center rounded-md ${clientStatusVariants[status]}`}
            >
              {status.toUpperCase()}
            </div>

            {status === "pending" ? (
              <div>
                <Dropdown
                  value={status}
                  onChange={handleChangeStatus}
                  className="min-w-35"
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "active", label: "Activate" },
                    { value: "inactive", label: "Deactivate" },
                  ]}
                />
              </div>
            ) : (
              <div>
                <Button
                  className="cursor-pointer"
                  variant={`${status === "active" ? "destructive" : "success"}`}
                  onClick={() => handleChangeStatus()}
                >
                  {status === "active" ? `Deactivate` : `Activate`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
