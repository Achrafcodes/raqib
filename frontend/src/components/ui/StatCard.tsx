import { useCountUp } from '../../hooks/useCountUp';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  subColor?: 'accent' | 'muted' | 'overdue';
  formatFn?: (n: number) => string;
}

export default function StatCard({ label, value, prefix = '', suffix = '', sub, subColor = 'muted', formatFn }: StatCardProps) {
  const animated = useCountUp(value);
  const display = formatFn ? formatFn(animated) : animated.toLocaleString();

  const subClass =
    subColor === 'accent'  ? 'text-raqib-accent' :
    subColor === 'overdue' ? 'text-status-overdue' :
    'text-raqib-muted';

  return (
    <div className="px-6 py-5 flex flex-col justify-between min-h-[100px] group">
      <p className="text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em] mb-3 select-none">
        {label}
      </p>
      <div>
        <p className="num text-[36px] font-bold text-raqib-text leading-none mb-2 group-hover:text-raqib-accent transition-colors duration-300">
          {prefix}{display}{suffix}
        </p>
        <p className={`text-[11px] ${subClass}`}>{sub}</p>
      </div>
    </div>
  );
}
