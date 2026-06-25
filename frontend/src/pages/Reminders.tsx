import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useRefresh } from '../context/RefreshContext';
import type { Reminder } from '../types';
import AddReminderModal from '../components/reminders/AddReminderModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import PageLoader from '../components/ui/PageLoader';

const FILTERS = ['all', 'pending', 'done'];

function clientName(r: Reminder): string {
  if (!r.clientId) return '';
  if (typeof r.clientId === 'object') return (r.clientId as { name: string }).name;
  return '';
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function isOverdue(r: Reminder) {
  return !r.isDone && new Date(r.dueDate) < new Date();
}

function isDueToday(r: Reminder) {
  if (r.isDone) return false;
  const due = new Date(r.dueDate);
  const now = new Date();
  return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate();
}

export default function Reminders() {
  const { tick, refresh } = useRefresh();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/reminders')
      .then((r) => setReminders(r.data.data))
      .catch(() => setReminders([]))
      .finally(() => setLoading(false));
  }, [tick]);

  const handleToggleDone = async (r: Reminder) => {
    setToggling(r._id);
    try {
      if (!r.isDone) {
        await api.patch(`/api/reminders/${r._id}/done`);
        setReminders((prev) => prev.map((x) => x._id === r._id ? { ...x, isDone: true } : x));
      } else {
        await api.put(`/api/reminders/${r._id}`, { ...r, isDone: false, clientId: typeof r.clientId === 'object' && r.clientId ? (r.clientId as { _id: string })._id : r.clientId });
        setReminders((prev) => prev.map((x) => x._id === r._id ? { ...x, isDone: false } : x));
      }
      refresh();
    } catch { /* silent */ } finally { setToggling(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete._id);
    try {
      await api.delete(`/api/reminders/${confirmDelete._id}`);
      setReminders((prev) => prev.filter((r) => r._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch { /* silent */ } finally { setDeleting(null); }
  };

  const overdueCount = reminders.filter(isOverdue).length;
  const dueTodayCount = reminders.filter(isDueToday).length;
  const doneCount = reminders.filter((r) => r.isDone).length;

  const filtered = reminders.filter((r) => {
    const matchFilter = filter === 'all' || (filter === 'done' ? r.isDone : !r.isDone);
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || clientName(r).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }).sort((a, b) => {
    if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 leading-tight">Reminders</h1>
          <p className="text-[13px] text-r-3 mt-[2px]">{reminders.length} total</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)' }}>
          <span className="text-[16px] leading-none">+</span>
          New Reminder
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Overdue',   value: overdueCount,   color: 'var(--overdue)' },
          { label: 'Due Today', value: dueTodayCount,  color: 'var(--pending)' },
          { label: 'Completed', value: doneCount,      color: 'var(--paid)'    },
        ].map((card) => (
          <div key={card.label} className="rounded-[12px] border border-r-border px-5 py-4" style={{ background: 'var(--surface)' }}>
            <p className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em] mb-1">{card.label}</p>
            <p className="text-[28px] font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reminders…"
          className="bg-r-surface border border-r-border rounded-[8px] px-3 py-[8px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors w-56" />
        <div className="flex items-center gap-1 bg-r-surface border border-r-border rounded-[8px] p-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-[5px] rounded-[6px] text-[12px] font-medium capitalize cursor-pointer transition-all ${filter === f ? 'bg-r-accent text-[#0C0E14] font-semibold' : 'text-r-3 hover:text-r-1 hover:bg-r-s2'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-[13px] text-r-3">
            {search || filter !== 'all' ? 'No reminders match your filters.' : 'No reminders yet. Add your first one!'}
          </div>
        ) : (
          filtered.map((r) => {
            const overdue = isOverdue(r);
            const today = isDueToday(r);
            return (
              <div key={r._id}
                className={`flex items-start gap-4 px-5 py-4 rounded-[12px] border transition-all ${r.isDone ? 'opacity-50' : ''}`}
                style={{
                  background: 'var(--surface)',
                  borderColor: overdue ? 'rgba(248,113,113,0.3)' : today ? 'rgba(251,191,36,0.3)' : 'var(--border)',
                }}>

                {/* Checkbox */}
                <button
                  onClick={() => handleToggleDone(r)}
                  disabled={toggling === r._id}
                  className="mt-[2px] w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    borderColor: r.isDone ? 'var(--paid)' : overdue ? 'var(--overdue)' : 'var(--border-2)',
                    background: r.isDone ? 'var(--paid)' : 'transparent',
                  }}
                >
                  {r.isDone && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0C0E14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-[13px] font-semibold ${r.isDone ? 'line-through text-r-3' : 'text-r-1'}`}>{r.title}</p>
                    {overdue && !r.isDone && (
                      <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-[4px]" style={{ background: 'var(--overdue-bg)', color: 'var(--overdue)' }}>Overdue</span>
                    )}
                    {today && !r.isDone && (
                      <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-[4px]" style={{ background: 'var(--pending-bg)', color: 'var(--pending)' }}>Today</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={`text-[11px] ${overdue && !r.isDone ? '' : 'text-r-3'}`}
                      style={overdue && !r.isDone ? { color: 'var(--overdue)' } : undefined}>
                      {formatDate(r.dueDate)}
                    </span>
                    {clientName(r) && (
                      <span className="text-[11px] text-r-3 flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        {clientName(r)}
                      </span>
                    )}
                  </div>

                  {r.note && <p className="text-[12px] text-r-3 mt-[6px] leading-relaxed">{r.note}</p>}
                </div>

                {/* Delete */}
                <button onClick={() => setConfirmDelete(r)} disabled={deleting === r._id}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-[#F87171] hover:bg-r-s2 transition-all cursor-pointer disabled:opacity-40 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {showAdd && <AddReminderModal onClose={() => setShowAdd(false)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete reminder"
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={!!deleting}
        />
      )}
    </div>
  );
}
