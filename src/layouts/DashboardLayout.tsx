import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <Outlet />
    </main>
  );
}
