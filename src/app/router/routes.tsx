import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/DashboardPage";
import SalesPage from "../../pages/SalesPage";
import ReviewsPage from "../../pages/ReviewsPage";
import ErrorPage from "../../pages/ErrorPage";
import { TableSkeleton } from "../../shared/components/LoadingSkeleton";
import ClientDetailsPage from "../../pages/clientDetails/ClientDetailsPage";

const ClientsPage = lazy(() => import("../../pages/clients/ClientsPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: (
      <DashboardLayout>
        <ErrorPage />
      </DashboardLayout>
    ),
    children: [
      { index: true, Component: DashboardPage },
      {
        path: "clients",
        element: (
          <Suspense fallback={<TableSkeleton />}>
            <ClientsPage />
          </Suspense>
        ),
      },
      { path: "sales", Component: SalesPage },
      { path: "reviews", Component: ReviewsPage },
      { path: "clients/:clientUsername", Component: ClientDetailsPage },
    ],
  },
]);
