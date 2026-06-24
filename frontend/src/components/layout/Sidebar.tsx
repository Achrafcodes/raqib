import { useEffect, useState } from 'react';
import { UserPlusIcon, FolderIcon, FileTextIcon, ClockIcon, PlusIcon } from '../ui/Icons';
import api from '../../utils/api';
import type { Reminder, Project } from '../../types';
import AddClientModal from '../clients/AddClientModal';

type Action = { icon: React.ReactNode; label: string; key: string };
const QUICK_ACTIONS: Action[] = [
  { icon: <UserPlusIcon size={24} />, label: 'New Client', key: 'client' },
  { icon: <FolderIcon size={24} />, label: 'New Project', key: 'project' },
  { icon: <FileTextIcon size={24} />, label: 'Invoice', key: 'invoice' },
  { icon: <ClockIcon size={24} />, label: 'Reminder', key: 'reminder' },
];

const AVATAR_COLORS = ['#1E3A5F', '#3D1F5F', '#3D2B1F', '#1F3D2B', '#3D3D1F'];

function avatarColor(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function accentForDue(dueDate: string): string {
  const diff = new Date(dueDate).getTime() - Date.now();
  if (diff < 0) return 'var(--overdue)';
  if (diff < 86400000) return 'var(--overdue)';
  if (diff < 86400000 * 2) return 'var(--pending)';
  return 'var(--paid)';
}

function formatDue(dueDate: string): string {
  const d = new Date(dueDate);
  const diff = d.getTime() - Date.now();
  if (diff < 0) return 'Overdue';
  if (diff < 86400000) return 'Today, ' + d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
  if (diff < 86400000 * 2) return 'Tomorrow';
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' });
}

const LABEL = 'text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]';

export default function Sidebar() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [thisMonth, setThisMonth] = useState(0);
  const [showAddClient, setShowAddClient] = useState(false);

  const refresh = () => {
    api.get('/api/projects').then((res) => {
      const all: Project[] = res.data.data;
      setProjects(all.filter((p) => p.status === 'in-progress').slice(0, 3));
    });
  };

  useEffect(() => {
    api.get('/api/reminders').then((res) => {
      const all: Reminder[] = res.data.data;
      setReminders(all.filter((r) => !r.isDone).slice(0, 3));
    });
    api.get('/api/projects').then((res) => {
      const all: Project[] = res.data.data;
      setProjects(all.filter((p) => p.status === 'in-progress').slice(0, 3));
    });
    api.get('/api/dashboard/stats').then((res) => {
      const chart: { month: string; earnings: number }[] = res.data.data.earningsChart;
      if (chart.length) setThisMonth(chart[chart.length - 1].earnings);
    });
  }, []);

  return (
    <aside className="w-[320px] shrink-0 bg-r-bg border-l border-r-border px-6 py-6 overflow-y-auto flex flex-col gap-7">

      {/* THIS MONTH */}
      <div
        className="rounded-[12px] p-6 border border-[#2A5C4A] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E5C45 0%, #143A2E 100%)' }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9FE9C8]">This Month</span>
          <span className="text-[11px] font-medium text-[#9FE9C8] opacity-70">
            {new Date().toLocaleDateString('en', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        <p className="font-bold text-white tabular-nums leading-none" style={{ fontSize: '38px', letterSpacing: '-0.03em' }}>
          ${thisMonth.toLocaleString()}
        </p>
        <p className="text-[13px] font-medium text-[#9FE9C8] mt-3">
          {thisMonth === 0 ? 'No earnings yet this month' : 'earned this month'}
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <p className={`${LABEL} mb-3`}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-[10px]">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => { if (a.key === 'client') setShowAddClient(true); }}
              className="bg-r-surface border border-r-border rounded-[10px] py-5 flex flex-col items-center gap-[10px] cursor-pointer hover:border-r-b2 hover:bg-r-s2 transition-all duration-150"
            >
              <span className="text-r-accent">{a.icon}</span>
              <span className="text-[12px] font-medium text-r-2 text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FOLLOW-UPS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Follow-ups</p>
          <button className="text-r-3 hover:text-r-2 transition-colors cursor-pointer">
            <PlusIcon size={16} />
          </button>
        </div>
        {reminders.length === 0 ? (
          <p className="text-[12px] text-r-3">No follow-ups pending.</p>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {reminders.map((r) => (
              <div
                key={r._id}
                className="bg-r-surface border border-r-border rounded-[8px] px-4 py-[12px] flex justify-between items-center gap-2"
                style={{ borderLeft: `2px solid ${accentForDue(r.dueDate)}` }}
              >
                <span className="text-[13px] font-medium text-r-1 truncate">{r.title}</span>
                <span className="text-[11px] text-r-3 shrink-0 whitespace-nowrap">{formatDue(r.dueDate)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE PROJECTS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className={LABEL}>Active Projects</p>
          <span className="text-[12px] font-medium text-r-accent cursor-pointer hover:opacity-80 transition-opacity">All →</span>
        </div>
        {projects.length === 0 ? (
          <p className="text-[12px] text-r-3">No active projects.</p>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {projects.map((p) => {
              const clientName = typeof p.clientId === 'object' && p.clientId !== null
                ? (p.clientId as { _id: string; name: string }).name
                : 'Client';
              return (
                <div key={p._id} className="flex items-center gap-[12px]">
                  <div
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: avatarColor(p.title) }}
                  >
                    {initials(p.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-r-1 truncate">{p.title}</p>
                    <p className="text-[11px] text-r-3 mt-[2px]">{clientName}</p>
                    <div className="mt-[6px] h-[3px] bg-r-border rounded-full">
                      <div className="h-full bg-r-accent rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>

    {showAddClient && (
      <AddClientModal onClose={() => setShowAddClient(false)} onCreated={refresh} />
    )}
  );
}
