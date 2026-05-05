import { AlertTriangle, FileQuestion, Home, RotateCw } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import Button from "../components/ui/Button";

interface ErrorView {
  Icon: typeof AlertTriangle;
  badge: string;
  heading: string;
  subtext: string;
  detail?: string;
}

function resolveErrorView(error: unknown): ErrorView {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        Icon: FileQuestion,
        badge: "404",
        heading: "Page not found",
        subtext: "The page you're looking for doesn't exist or has been moved.",
      };
    }

    const detail =
      typeof error.data === "string" && error.data.length > 0
        ? error.data
        : undefined;

    return {
      Icon: AlertTriangle,
      badge: String(error.status),
      heading: "Something went wrong",
      subtext: error.statusText || "An unexpected response was received.",
      detail,
    };
  }

  if (error instanceof Error) {
    return {
      Icon: AlertTriangle,
      badge: "Error",
      heading: "Something went wrong",
      subtext: "An unexpected error occurred while rendering this page.",
      detail: error.message || undefined,
    };
  }

  return {
    Icon: AlertTriangle,
    badge: "Error",
    heading: "Something went wrong",
    subtext: "An unexpected error occurred.",
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { Icon, badge, heading, subtext, detail } = resolveErrorView(error);

  return (
    <div className="min-h-full flex items-center justify-center py-8 md:py-12 px-4">
      <div className="bg-background rounded-xl border border-border shadow-sm p-8 md:p-16 max-w-2xl w-full text-center">
        <div className="mx-auto mb-6 flex size-20 md:size-24 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-10 md:size-12" />
        </div>

        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {badge}
        </span>

        <h2 className="mt-4 text-2xl md:text-3xl font-semibold">{heading}</h2>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">{subtext}</p>

        {detail && (
          <pre className="mt-6 rounded-md bg-muted px-4 py-3 text-left text-xs text-muted-foreground font-mono whitespace-pre-wrap wrap-break-word">
            {detail}
          </pre>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")}>
            <Home className="size-4" />
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCw className="size-4" />
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}
