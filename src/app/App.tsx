import { RouterProvider } from "react-router";
import { router } from "./router/routes";
import QueryProvider from "./providers/QueryProvider";
import ToastProvider from "./providers/ToastProvider";

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
