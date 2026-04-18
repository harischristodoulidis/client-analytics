interface ClientDetailsCardProps {
  detailsContext: string;
  children: React.ReactNode;
}

export default function ClientDetailsCard({
  detailsContext,
  children,
}: ClientDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">{detailsContext}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
