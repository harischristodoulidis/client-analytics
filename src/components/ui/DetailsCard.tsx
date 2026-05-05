interface ClientDetailsCardProps {
  detailsContext: string;
  children: React.ReactNode;
}

export default function DetailsCard({
  detailsContext,
  children,
}: ClientDetailsCardProps) {
  return (
    <div className="rounded-xl shadow-sm border border-border p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">{detailsContext}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
