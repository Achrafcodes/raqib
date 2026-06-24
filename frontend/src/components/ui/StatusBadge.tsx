type Status = string;

const MAP: Record<string, { label: string; color: string; bg: string }> = {
  paid:         { label: 'Paid',         color: 'var(--paid)',    bg: 'var(--paid-bg)'    },
  pending:      { label: 'Pending',      color: 'var(--pending)', bg: 'var(--pending-bg)' },
  overdue:      { label: 'Overdue',      color: 'var(--overdue)', bg: 'var(--overdue-bg)' },
  lead:         { label: 'Lead',         color: 'var(--lead)',    bg: 'var(--lead-bg)'    },
  lost:         { label: 'Lost',         color: 'var(--lost)',    bg: 'var(--lost-bg)'    },
  draft:        { label: 'Draft',        color: 'var(--text-2)',  bg: 'rgba(148,163,184,0.10)' },
  sent:         { label: 'Sent',         color: 'var(--lead)',    bg: 'var(--lead-bg)'    },
  negotiating:  { label: 'Negotiating',  color: 'var(--pending)', bg: 'var(--pending-bg)' },
  active:       { label: 'Active',       color: 'var(--paid)',    bg: 'var(--paid-bg)'    },
  done:         { label: 'Done',         color: 'var(--text-2)',  bg: 'rgba(148,163,184,0.10)' },
  cancelled:    { label: 'Cancelled',    color: 'var(--overdue)', bg: 'var(--overdue-bg)' },
  'not-started':{ label: 'Not Started',  color: 'var(--text-3)',  bg: 'rgba(136,153,170,0.10)' },
  'in-progress':{ label: 'In Progress',  color: 'var(--lead)',    bg: 'var(--lead-bg)'    },
  review:       { label: 'Review',       color: 'var(--pending)', bg: 'var(--pending-bg)' },
};

const FALLBACK = { label: 'Unknown', color: 'var(--text-3)', bg: 'rgba(136,153,170,0.10)' };

export default function StatusBadge({ status }: { status: Status }) {
  const s = MAP[status] ?? { ...FALLBACK, label: status };
  return (
    <span
      className="inline-flex items-center gap-[5px] px-2 py-[2px] rounded-[4px] text-[11px] font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
