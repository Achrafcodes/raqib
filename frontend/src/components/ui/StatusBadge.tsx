type Status = 'paid' | 'pending' | 'overdue' | 'lead' | 'lost';

const MAP: Record<Status, { label: string; color: string; bg: string }> = {
  paid: { label: 'Paid', color: 'var(--paid)', bg: 'var(--paid-bg)' },
  pending: { label: 'Pending', color: 'var(--pending)', bg: 'var(--pending-bg)' },
  overdue: { label: 'Overdue', color: 'var(--overdue)', bg: 'var(--overdue-bg)' },
  lead: { label: 'Lead', color: 'var(--lead)', bg: 'var(--lead-bg)' },
  lost: { label: 'Lost', color: 'var(--lost)', bg: 'var(--lost-bg)' },
};

export default function StatusBadge({ status }: { status: Status }) {
  const s = MAP[status];
  return (
    <span
      className="inline-flex items-center gap-[5px] px-2 py-[2px] rounded-[4px] text-[11px] font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
