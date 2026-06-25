import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../utils/api';
import { useRefresh } from '../context/RefreshContext';
import type { Project } from '../types';
import AddProjectModal from '../components/projects/AddProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import PageLoader from '../components/ui/PageLoader';

const STATUSES = ['all', 'not-started', 'in-progress', 'review', 'done', 'cancelled'];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  'not-started': { color: 'var(--text-3)',  bg: 'rgba(136,153,170,0.10)' },
  'in-progress': { color: 'var(--lead)',    bg: 'var(--lead-bg)'         },
  review:        { color: 'var(--pending)', bg: 'var(--pending-bg)'      },
  done:          { color: 'var(--paid)',    bg: 'var(--paid-bg)'         },
  cancelled:     { color: 'var(--overdue)', bg: 'var(--overdue-bg)'      },
};

const STATUS_OPTS = ['not-started', 'in-progress', 'review', 'done', 'cancelled'].map((s) => ({
  value: s, label: s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
}));

function clientName(p: Project): string {
  if (!p.clientId) return '—';
  if (typeof p.clientId === 'object') return (p.clientId as { name: string }).name;
  return '—';
}

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(p: Project) {
  if (!p.deadline || p.status === 'done' || p.status === 'cancelled') return false;
  return new Date(p.deadline) < new Date();
}

function StatusDropdown({ status, onChange, disabled }: { status: string; onChange: (s: string) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const style = STATUS_STYLES[status] ?? { color: 'var(--text-3)', bg: 'rgba(136,153,170,0.10)' };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setMenuStyle({ position: 'fixed', top: r.bottom + 4, left: r.left, width: 148, zIndex: 9999 });
    }
    setOpen((p) => !p);
  };

  const label = STATUS_OPTS.find((o) => o.value === status)?.label ?? status;

  return (
    <div className="inline-block">
      <button ref={triggerRef} type="button" disabled={disabled} onClick={handleOpen}
        className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[4px] text-[11px] font-medium cursor-pointer border-none outline-none disabled:opacity-50"
        style={{ background: style.bg, color: style.color }}>
        <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: style.color }} />
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && createPortal(
        <ul ref={menuRef} style={{ ...menuStyle, background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          className="rounded-[8px] border border-r-border overflow-hidden py-1">
          {STATUS_OPTS.map((opt) => {
            const s = STATUS_STYLES[opt.value] ?? { color: 'var(--text-3)', bg: 'transparent' };
            return (
              <li key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-[7px] text-[12px] cursor-pointer hover:bg-r-s2 transition-colors"
                style={{ color: s.color }}>
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: s.color }} />
                {opt.label}
              </li>
            );
          })}
        </ul>,
        document.body
      )}
    </div>
  );
}

export default function Projects() {
  const { tick, refresh } = useRefresh();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/projects')
      .then((r) => setProjects(r.data.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [tick]);

  const handleStatusChange = async (project: Project, status: string) => {
    setUpdatingStatus(project._id);
    try {
      await api.put(`/api/projects/${project._id}`, { ...project, status, clientId: typeof project.clientId === 'object' ? (project.clientId as { _id: string })._id : project.clientId });
      setProjects((prev) => prev.map((p) => p._id === project._id ? { ...p, status: status as Project['status'] } : p));
      refresh();
    } catch { /* silent */ } finally { setUpdatingStatus(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete._id);
    try {
      await api.delete(`/api/projects/${confirmDelete._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch { /* silent */ } finally { setDeleting(null); }
  };

  const filtered = projects.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || clientName(p).toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 leading-tight">Projects</h1>
          <p className="text-[13px] text-r-3 mt-[2px]">{projects.length} total</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)' }}>
          <span className="text-[16px] leading-none">+</span>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
          className="bg-r-surface border border-r-border rounded-[8px] px-3 py-[8px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors w-56" />
        <div className="flex items-center gap-1 bg-r-surface border border-r-border rounded-[8px] p-1 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-[5px] rounded-[6px] text-[12px] font-medium capitalize cursor-pointer transition-all ${statusFilter === s ? 'bg-r-accent text-[#0C0E14] font-semibold' : 'text-r-3 hover:text-r-1 hover:bg-r-s2'}`}>
              {s.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[12px] border border-r-border overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="grid text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] px-5 py-3 border-b border-r-border"
          style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 80px' }}>
          <span>Project</span>
          <span>Client</span>
          <span>Price</span>
          <span>Deadline</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-r-3">
            {search || statusFilter !== 'all' ? 'No projects match your filters.' : 'No projects yet. Create your first one!'}
          </div>
        ) : (
          filtered.map((project, i) => (
            <div key={project._id}
              className={`grid items-center px-5 py-4 hover:bg-r-s2 transition-colors ${i < filtered.length - 1 ? 'border-b border-r-border' : ''}`}
              style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 80px' }}>

              {/* Title */}
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-r-1 truncate">{project.title}</p>
                {project.description && <p className="text-[11px] text-r-3 truncate mt-[1px]">{project.description}</p>}
              </div>

              {/* Client */}
              <p className="text-[12px] text-r-2 truncate">{clientName(project)}</p>

              {/* Price */}
              <p className="text-[12px] font-medium text-r-1 tabular-nums">
                {project.price > 0 ? `${project.currency} ${project.price.toLocaleString()}` : '—'}
              </p>

              {/* Deadline */}
              <p className={`text-[12px] ${isOverdue(project) ? '' : 'text-r-3'}`}
                style={isOverdue(project) ? { color: 'var(--overdue)' } : undefined}>
                {formatDate(project.deadline)}
                {isOverdue(project) && <span className="ml-1 text-[10px]">overdue</span>}
              </p>

              {/* Status dropdown */}
              <StatusDropdown status={project.status} disabled={updatingStatus === project._id} onChange={(s) => handleStatusChange(project, s)} />

              {/* Actions */}
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => setEditing(project)}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-r-1 hover:bg-r-bg transition-all cursor-pointer" title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button onClick={() => setConfirmDelete(project)} disabled={deleting === project._id}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-[#F87171] hover:bg-r-bg transition-all cursor-pointer disabled:opacity-40" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && <AddProjectModal onClose={() => setShowAdd(false)} />}
      {editing && <EditProjectModal project={editing} onClose={() => setEditing(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete project"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={!!deleting}
        />
      )}
    </div>
  );
}
