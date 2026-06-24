interface StatCardProps {
  label: string;
  value: string;
  trendValue: string;
  trendText: string;
  trendColor: string;
}

export default function StatCard({ label, value, trendValue, trendText, trendColor }: StatCardProps) {
  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] p-6 flex flex-col gap-0 hover:border-r-b2 transition-colors">
      <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em] mb-4">{label}</span>
      <span className="text-[34px] font-bold text-r-1 tabular-nums tracking-tight mb-3 leading-none">{value}</span>
      <div className="flex items-center gap-[6px]">
        <span className="text-[11px] font-medium" style={{ color: trendColor }}>{trendValue}</span>
        {trendText && <span className="text-[11px] text-r-3">{trendText}</span>}
      </div>
    </div>
  );
}
