type Status = 'paid' | 'pending' | 'overdue' | 'lead' | 'lost' | 'draft' | 'active' |
              'not-started' | 'in-progress' | 'review' | 'done' | 'cancelled' |
              'negotiating' | 'sent';

const config: Record<string, { color: string; label: string }> = {
  paid:        { color: '#4ADE80', label: 'Paid' },
  pending:     { color: '#FBBF24', label: 'Pending' },
  overdue:     { color: '#F87171', label: 'Overdue' },
  lead:        { color: '#60A5FA', label: 'Lead' },
  lost:        { color: '#6B7280', label: 'Lost' },
  draft:       { color: '#6B7280', label: 'Draft' },
  sent:        { color: '#FBBF24', label: 'Sent' },
  active:      { color: '#4ADE80', label: 'Active' },
  done:        { color: '#4ADE80', label: 'Done' },
  'not-started':  { color: '#6B7280', label: 'Not Started' },
  'in-progress':  { color: '#60A5FA', label: 'In Progress' },
  review:         { color: '#FBBF24', label: 'Review' },
  cancelled:      { color: '#F87171', label: 'Cancelled' },
  negotiating:    { color: '#FBBF24', label: 'Negotiating' },
};

export default function StatusBadge({ status }: { status: Status | string }) {
  const { color, label } = config[status] ?? { color: '#6B7280', label: status };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium"
      style={{ backgroundColor: `${color}26`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
