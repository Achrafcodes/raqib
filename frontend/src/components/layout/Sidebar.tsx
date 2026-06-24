const QUICK_ACTIONS = [
  { icon: '＋', label: 'New Client' },
  { icon: '📁', label: 'New Project' },
  { icon: '📄', label: 'Invoice' },
  { icon: '🔔', label: 'Reminder' },
];

const FOLLOW_UPS = [
  { name: 'Ahmed S.', time: 'Follow up today', bar: 'var(--overdue)', pct: 90 },
  { name: 'Sara M.', time: 'Tomorrow', bar: 'var(--pending)', pct: 55 },
  { name: 'John D.', time: 'In 3 days', bar: 'var(--paid)', pct: 25 },
];

const ACTIVE_PROJECTS = [
  { letter: 'B', name: 'Brand Identity', client: 'Ahmed S.', pct: 80 },
  { letter: 'W', name: 'Web Dev', client: 'Sara M.', pct: 45 },
  { letter: 'S', name: 'SEO Campaign', client: 'John D.', pct: 20 },
];

const LABEL = 'text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]';

export default function Sidebar() {
  return (
    <aside className="w-[248px] shrink-0 bg-r-bg border-l border-r-border px-5 py-6 overflow-y-auto flex flex-col gap-6">
      {/* SECTION 1 — THIS MONTH (teal/green card) */}
      <div
        className="rounded-[8px] p-5 border border-[#2A5C4A] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E5C45 0%, #143A2E 100%)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9FE9C8]">This Month</span>
          <span className="text-[10px] text-[#9FE9C8]">Jan 2026</span>
        </div>
        <p className="text-[28px] font-bold text-white tabular-nums" style={{ letterSpacing: '-0.02em' }}>
          $4,200
        </p>
        <p className="text-[11px] text-[#9FE9C8] mt-1">↗ +18% vs last month</p>
        <div className="mt-4 h-[3px] w-full bg-[#0F2C22] rounded-full">
          <div className="h-full bg-r-accent rounded-full" style={{ width: '60%' }} />
        </div>
        <p className="text-[10px] text-[#9FE9C8] mt-[6px]">60% of monthly target</p>
      </div>

      {/* SECTION 2 — QUICK ACTIONS */}
      <div>
        <p className={`${LABEL} mb-3`}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-[8px]">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.label}
              className="bg-r-surface border border-r-border rounded-[6px] p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-r-b2 transition-colors"
            >
              <span className="text-r-accent text-[18px]">{a.icon}</span>
              <span className="text-[11px] text-r-2 text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3 — FOLLOW-UPS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Follow-ups</p>
          <span className="text-r-3 text-[14px] cursor-pointer">+</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          {FOLLOW_UPS.map((f) => (
            <div
              key={f.name}
              className="bg-r-surface border border-r-border rounded-[6px] p-3 flex flex-col gap-[6px]"
              style={{ borderLeft: `2px solid ${f.bar}` }}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-[12px] font-medium text-r-1 truncate">{f.name}</span>
                <span className="text-[10px] text-r-3 shrink-0 whitespace-nowrap">{f.time}</span>
              </div>
              <div className="h-[2px] w-full bg-r-border rounded-full">
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.bar }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — ACTIVE PROJECTS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Active Projects</p>
          <span className="text-[11px] text-r-accent cursor-pointer">All →</span>
        </div>
        <div className="flex flex-col gap-[12px]">
          {ACTIVE_PROJECTS.map((p) => (
            <div key={p.name} className="flex items-center gap-[8px]">
              <div className="w-[26px] h-[26px] bg-r-s2 border border-r-border rounded-[5px] flex items-center justify-center text-[10px] font-semibold text-r-accent shrink-0">
                {p.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-r-1 truncate">{p.name}</p>
                <p className="text-[10px] text-r-3">{p.client}</p>
                <div className="mt-[4px] h-[2px] bg-r-border rounded-full">
                  <div className="h-full bg-r-accent rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-r-3 ml-1">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
