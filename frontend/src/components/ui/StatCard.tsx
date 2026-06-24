import { TrendUpIcon, TrendDownIcon } from './Icons';

interface StatCardProps {
  label: string;
  value: string;
  trendValue: string;
  trendText: string;
  trendColor: string;
  trendUp: boolean;
}

export default function StatCard({ label, value, trendValue, trendText, trendColor, trendUp }: StatCardProps) {
  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] px-6 py-5 flex flex-col hover:border-r-b2 transition-colors">
      <span className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.1em] mb-2">{label}</span>
      <span className="text-[32px] font-bold text-r-1 tabular-nums leading-none tracking-tight mb-2">{value}</span>
      <div className="flex items-center gap-[5px]">
        <span style={{ color: trendColor }}>
          {trendUp ? <TrendUpIcon size={11} /> : <TrendDownIcon size={11} />}
        </span>
        <span className="text-[11px] font-semibold" style={{ color: trendColor }}>{trendValue}</span>
        {trendText && <span className="text-[11px] text-r-3">{trendText}</span>}
      </div>
    </div>
  );
}
