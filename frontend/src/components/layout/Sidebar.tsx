import { UserPlusIcon, FolderIcon, FileTextIcon, ClockIcon, PlusIcon } from '../ui/Icons';

const QUICK_ACTIONS = [
  { icon: <UserPlusIcon size={24} />, label: 'New Client' },
  { icon: <FolderIcon size={24} />, label: 'New Project' },
  { icon: <FileTextIcon size={24} />, label: 'Invoice' },
  { icon: <ClockIcon size={24} />, label: 'Reminder' },
];

const FOLLOW_UPS = [
  { name: 'Sana Rashid', time: 'Today, 3pm', accent: 'var(--overdue)' },
  { name: 'Marcus Teo', time: 'Tomorrow, 10am', accent: 'var(--pending)' },
  { name: 'James Kim', time: 'Thu, 2pm', accent: 'var(--paid)' },
];

const ACTIVE_PROJECTS = [
  { initials: 'WT', name: 'Web Redesign', client: 'Marcus Teo', pct: 72, color: '#1E3A5F' },
  { initials: 'MA', name: 'Mobile App UI', client: 'James Kim', pct: 38, color: '#3D1F5F' },
  { initials: 'JK', name: 'Brand Identity', client: 'Sana Rashid', pct: 91, color: '#1F3D2B' },
];

const LABEL = 'text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]';

export default function Sidebar() {
  return (
    <aside className="w-[320px] shrink-0 bg-r-bg border-l border-r-border px-6 py-6 overflow-y-auto flex flex-col gap-7">

      {/* SECTION 1 — THIS MONTH */}
      <div
        className="rounded-[12px] p-6 border border-[#2A5C4A] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E5C45 0%, #143A2E 100%)' }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9FE9C8]">This Month</span>
          <span className="text-[11px] font-medium text-[#9FE9C8] opacity-70">Jan 2026</span>
        </div>
        <p
          className="font-bold text-white tabular-nums leading-none"
          style={{ fontSize: '38px', letterSpacing: '-0.03em' }}
        >
          $4,200
        </p>
        <p className="text-[13px] font-medium text-[#9FE9C8] mt-2">↗ +18% vs last month</p>
        <div className="mt-4 h-[4px] w-full bg-[#0F2C22] rounded-full">
          <div className="h-full bg-r-accent rounded-full" style={{ width: '60%' }} />
        </div>
        <p className="text-[12px] text-[#9FE9C8] opacity-70 mt-[7px]">60% of monthly target</p>
      </div>

      {/* SECTION 2 — QUICK ACTIONS */}
      <div>
        <p className={`${LABEL} mb-3`}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-[10px]">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.label}
              className="bg-r-surface border border-r-border rounded-[10px] py-5 flex flex-col items-center gap-[10px] cursor-pointer hover:border-r-b2 hover:bg-r-s2 transition-all duration-150"
            >
              <span className="text-r-accent">{a.icon}</span>
              <span className="text-[12px] font-medium text-r-2 text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3 — FOLLOW-UPS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Follow-ups</p>
          <button className="text-r-3 hover:text-r-2 transition-colors cursor-pointer">
            <PlusIcon size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-[8px]">
          {FOLLOW_UPS.map((f) => (
            <div
              key={f.name}
              className="bg-r-surface border border-r-border rounded-[8px] px-4 py-[12px] flex justify-between items-center gap-2"
              style={{ borderLeft: `2px solid ${f.accent}` }}
            >
              <span className="text-[13px] font-medium text-r-1 truncate">{f.name}</span>
              <span className="text-[11px] text-r-3 shrink-0 whitespace-nowrap">{f.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — ACTIVE PROJECTS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Active Projects</p>
          <span className="text-[12px] font-medium text-r-accent cursor-pointer hover:opacity-80 transition-opacity">All →</span>
        </div>
        <div className="flex flex-col gap-[14px]">
          {ACTIVE_PROJECTS.map((p) => (
            <div key={p.name} className="flex items-center gap-[12px]">
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ background: p.color }}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-r-1 truncate">{p.name}</p>
                <p className="text-[11px] text-r-3 mt-[2px]">{p.client}</p>
                <div className="mt-[6px] h-[3px] bg-r-border rounded-full">
                  <div className="h-full bg-r-accent rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
              <span className="text-[12px] font-medium text-r-3 tabular-nums">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
