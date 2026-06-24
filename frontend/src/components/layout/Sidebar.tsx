import { UserPlusIcon, FolderIcon, FileTextIcon, ClockIcon, PlusIcon } from '../ui/Icons';

const QUICK_ACTIONS = [
  { icon: <UserPlusIcon size={18} />, label: 'New Client' },
  { icon: <FolderIcon size={18} />, label: 'New Project' },
  { icon: <FileTextIcon size={18} />, label: 'Invoice' },
  { icon: <ClockIcon size={18} />, label: 'Reminder' },
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

      {/* SECTION 1 — THIS MONTH */}
      <div
        className="rounded-[10px] p-5 border border-[#2A5C4A] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E5C45 0%, #143A2E 100%)' }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9FE9C8]">This Month</span>
          <span className="text-[10px] font-medium text-[#9FE9C8] opacity-70">Jan 2026</span>
        </div>
        <p
          className="font-bold text-white tabular-nums leading-none"
          style={{ fontSize: '32px', letterSpacing: '-0.03em' }}
        >
          $4,200
        </p>
        <p className="text-[12px] font-medium text-[#9FE9C8] mt-2">↗ +18% vs last month</p>
        <div className="mt-4 h-[3px] w-full bg-[#0F2C22] rounded-full">
          <div className="h-full bg-r-accent rounded-full" style={{ width: '60%' }} />
        </div>
        <p className="text-[11px] text-[#9FE9C8] opacity-70 mt-[6px]">60% of monthly target</p>
      </div>

      {/* SECTION 2 — QUICK ACTIONS */}
      <div>
        <p className={`${LABEL} mb-3`}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-[8px]">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.label}
              className="bg-r-surface border border-r-border rounded-[8px] p-4 flex flex-col items-center gap-[10px] cursor-pointer hover:border-r-b2 hover:bg-r-s2 transition-all duration-150"
            >
              <span className="text-r-accent">{a.icon}</span>
              <span className="text-[11px] font-medium text-r-2 text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3 — FOLLOW-UPS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Follow-ups</p>
          <button className="text-r-3 hover:text-r-2 transition-colors cursor-pointer">
            <PlusIcon size={14} />
          </button>
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
          <span className="text-[11px] font-medium text-r-accent cursor-pointer hover:opacity-80 transition-opacity">All →</span>
        </div>
        <div className="flex flex-col gap-[12px]">
          {ACTIVE_PROJECTS.map((p) => (
            <div key={p.name} className="flex items-center gap-[10px]">
              <div className="w-[28px] h-[28px] bg-r-s2 border border-r-border rounded-[6px] flex items-center justify-center text-[11px] font-bold text-r-accent shrink-0">
                {p.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-r-1 truncate">{p.name}</p>
                <p className="text-[10px] text-r-3 mt-[1px]">{p.client}</p>
                <div className="mt-[5px] h-[2px] bg-r-border rounded-full">
                  <div className="h-full bg-r-accent rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-medium text-r-3 tabular-nums">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
