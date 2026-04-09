import { createBrowserRouter } from "react-router";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "../../pages/DashboardPage";
import ClientsPage from "../../pages/ClientsPage";
import SalesPage from "../../pages/SalesPage";
import ReviewsPage from "../../pages/ReviewsPage";
import ReportsPage from "../../pages/ReportingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "clients", Component: ClientsPage },
      { path: "sales", Component: SalesPage },
      { path: "reviews", Component: ReviewsPage },
      { path: "reports", Component: ReportsPage },
    ],
  },
]);
