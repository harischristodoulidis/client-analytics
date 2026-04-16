export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="p-4 border-b border-border animate-pulse">
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
          <div className="h-4 w-20 bg-muted rounded"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  );
}
