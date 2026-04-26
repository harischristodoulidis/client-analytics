import { Activity, Calendar, DollarSign, Mail } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router";
import type { Client } from "../shared/api/types/clients";
import ClientDetailsHeader from "../components/content/clientDetails/ClientDetailsHeader";
import ClientDetailsCard from "../components/content/clientDetails/ClientDetailsCard";

export default function ClientDetailsPage() {
  const { clientUsername } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state ?? {};
  const client = state.client as Client;

  const labelClasses = "text-sm text-muted-foreground mb-1";

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      >
        Go Back
      </button>
      <ClientDetailsHeader username={clientUsername} client={client} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Contact Information */}
        <ClientDetailsCard detailsContext="Contact Information">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className={labelClasses}>Email</p>
              <a
                href={`mailto:${client.email}`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {client.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={labelClasses}>Joined Date</p>
              <p className="text-sm font-medium">
                {new Date(client.joinedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </ClientDetailsCard>

        {/* Financial Information */}
        <ClientDetailsCard detailsContext="Financial Information">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={labelClasses}>Total Spent</p>
              <p className="text-2xl font-bold">
                ${client.total_spent ? client.total_spent.toLocaleString() : 0}
              </p>
            </div>
          </div>
        </ClientDetailsCard>

        {/* Activity Section */}

        <ClientDetailsCard detailsContext="Recent Activity">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            No recent activity to display.
          </div>
        </ClientDetailsCard>
      </div>
    </div>
  );
}
