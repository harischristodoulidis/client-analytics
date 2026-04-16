interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 md:py-12 px-4 text-center">
      {icon && <div className="mb-2 md:mb-3 text-muted-foreground">{icon}</div>}
      <p className="text-xs md:text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
