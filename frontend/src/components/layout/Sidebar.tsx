import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import type { DashboardStats, Reminder, Project } from '../../types';
import Avatar from '../ui/Avatar';

const QuickAction = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between px-3 py-2.5 border border-raqib-border rounded-[4px] hover:border-raqib-accent transition-colors group w-full"
  >
    <span className="text-[12px] text-raqib-muted group-hover:text-raqib-text transition-colors">{label}</span>
    <span className="text-raqib-muted group-hover:text-raqib-accent transition-colors text-[14px] leading-none">+</span>
  </button>
);

const SectionLabel = ({ children }: { children: string }) => (
  <p className="text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em] mb-3">{children}</p>
);

export default function Sidebar() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/dashboard/stats').then((r) => setStats(r.data.data));
    api.get('/api/reminders').then((r) => setReminders(r.data.data.filter((rem: Reminder) => !rem.isDone).slice(0, 3)));
    api.get('/api/projects').then((r) => setProjects(r.data.data.filter((p: Project) => p.status === 'in-progress').slice(0, 3)));
  }, []);

  const formatDue = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    if (d.toDateString() === now.toDateString())
      return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (d.toDateString() === tomorrow.toDateString())
      return `Tomorrow`;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-60 flex-shrink-0 border-l border-raqib-border overflow-y-auto">
      <div className="flex flex-col divide-y divide-raqib-border">

        {/* This Month */}
        <div className="px-5 py-5">
          <SectionLabel>This Month</SectionLabel>
          <p className="num text-[28px] font-bold text-raqib-text leading-none mb-1">
            ${stats ? stats.totalEarned.toLocaleString() : '—'}
          </p>
          <p className="text-[11px] text-raqib-accent mb-3">+18% vs last month</p>
          <div className="w-full h-[2px] bg-raqib-border rounded-full">
            <div className="h-full bg-raqib-accent rounded-full transition-all duration-1000" style={{ width: '72%' }} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 py-5">
          <SectionLabel>Quick Actions</SectionLabel>
          <div className="flex flex-col gap-2">
            <QuickAction label="New Client"   onClick={() => navigate('/clients')} />
            <QuickAction label="New Project"  onClick={() => navigate('/projects')} />
            <QuickAction label="New Invoice"  onClick={() => navigate('/invoices')} />
            <QuickAction label="Set Reminder" onClick={() => navigate('/reminders')} />
          </div>
        </div>

        {/* Follow-ups */}
        <div className="px-5 py-5">
          <SectionLabel>Follow-ups</SectionLabel>
          {reminders.length === 0
            ? <p className="text-[12px] text-raqib-muted">No upcoming</p>
            : reminders.map((rem) => {
                const name = typeof rem.clientId === 'object' && rem.clientId ? rem.clientId.name : rem.title;
                return (
                  <div key={rem._id} className="flex items-center justify-between py-2 border-b border-raqib-border last:border-0">
                    <div className="flex items-center gap-2">
                      <Avatar name={name} size="sm" />
                      <span className="text-[12px] text-raqib-text truncate max-w-[80px]">{name}</span>
                    </div>
                    <span className="text-[10px] text-raqib-muted">{formatDue(rem.dueDate)}</span>
                  </div>
                );
              })
          }
        </div>

        {/* Active Projects */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Active Projects</SectionLabel>
            <button onClick={() => navigate('/projects')} className="text-[10px] text-raqib-accent -mt-3">All →</button>
          </div>
          {projects.length === 0
            ? <p className="text-[12px] text-raqib-muted">No active projects</p>
            : projects.map((proj, i) => {
                const clientName = typeof proj.clientId === 'object' ? (proj.clientId as { name: string }).name : '';
                const pct = [72, 45, 20][i] ?? 50;
                return (
                  <div key={proj._id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={proj.title} size="sm" />
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-raqib-text truncate leading-none">{proj.title}</p>
                          {clientName && <p className="text-[10px] text-raqib-muted mt-0.5">{clientName}</p>}
                        </div>
                      </div>
                      <span className="num text-[11px] text-raqib-muted flex-shrink-0">{pct}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-raqib-border rounded-full">
                      <div className="h-full bg-raqib-accent rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
          }
        </div>

      </div>
    </aside>
  );
}
