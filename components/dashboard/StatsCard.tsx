interface StatsCardProps {
  title: string;
  value: number;
}

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <h2 className="text-sm text-muted-foreground">
        {title}
      </h2>

      <p className="mt-2 text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}