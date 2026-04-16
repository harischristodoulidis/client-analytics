export default function ClientsPaginationButton({ ...props }) {
  return (
    <button
      className="px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-lg text-xs md:text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      {...props}
    ></button>
  );
}
