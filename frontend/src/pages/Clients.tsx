import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../utils/api';
import { useRefresh } from '../context/RefreshContext';
import type { Client } from '../types';
import Avatar from '../components/ui/Avatar';
import AddClientModal from '../components/clients/AddClientModal';
import EditClientModal from '../components/clients/EditClientModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import PageLoader from '../components/ui/PageLoader';

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  lead:        { color: 'var(--lead)',    bg: 'var(--lead-bg)'    },
  negotiating: { color: 'var(--pending)', bg: 'var(--pending-bg)' },
  active:      { color: 'var(--paid)',    bg: 'var(--paid-bg)'    },
  done:        { color: 'var(--text-2)',  bg: 'rgba(148,163,184,0.10)' },
  lost:        { color: 'var(--lost)',    bg: 'var(--lost-bg)'    },
};

const CLIENT_STATUS_OPTS = ['lead', 'negotiating', 'active', 'done', 'lost'].map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));

const STATUSES = ['all', 'lead', 'negotiating', 'active', 'done', 'lost'];

const INPUT = 'bg-r-surface border border-r-border rounded-[8px] px-3 py-[8px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors';

export default function Clients() {
  const { tick } = useRefresh();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/clients')
      .then((r) => setClients(r.data.data))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [tick]);

  const handleStatusChange = async (client: Client, status: string) => {
    setUpdatingStatus(client._id);
    try {
      await api.put(`/api/clients/${client._id}`, { ...client, status });
      setClients((prev) => prev.map((c) => c._id === client._id ? { ...c, status: status as Client['status'] } : c));
      refresh();
    } catch {
      // silent fail — status stays unchanged
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete._id);
    try {
      await api.delete(`/api/clients/${confirmDelete._id}`);
      setClients((prev) => prev.filter((c) => c._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch {
      // silent fail
    } finally {
      setDeleting(null);
    }
  };

  const filtered = clients.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 leading-tight">Clients</h1>
          <p className="text-[13px] text-r-3 mt-[2px]">{clients.length} total</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)' }}
        >
          <span className="text-[16px] leading-none">+</span>
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className={INPUT + ' w-full sm:w-56'}
        />
        <div className="flex items-center gap-1 bg-r-surface border border-r-border rounded-[8px] p-1 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-[5px] rounded-[6px] text-[12px] font-medium capitalize cursor-pointer transition-all whitespace-nowrap ${
                statusFilter === s ? 'bg-r-accent text-[#0C0E14] font-semibold' : 'text-r-3 hover:text-r-1 hover:bg-r-s2'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-[12px] border border-r-border overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="grid text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] px-5 py-3 border-b border-r-border"
          style={{ gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr 80px' }}>
          <span>Client</span><span>Contact</span><span>Company</span><span>Source</span><span>Status</span><span />
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-r-3">
            {search || statusFilter !== 'all' ? 'No clients match your filters.' : 'No clients yet. Add your first one!'}
          </div>
        ) : filtered.map((client, i) => (
          <div key={client._id}
            className={`grid items-center px-5 py-4 hover:bg-r-s2 transition-colors ${i < filtered.length - 1 ? 'border-b border-r-border' : ''}`}
            style={{ gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr 80px' }}>
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={client.name} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-r-1 truncate">{client.name}</p>
                {client.notes && <p className="text-[11px] text-r-3 truncate mt-[1px]">{client.notes}</p>}
              </div>
            </div>
            <div className="min-w-0">
              {client.email && <p className="text-[12px] text-r-2 truncate">{client.email}</p>}
              {client.phone && <p className="text-[11px] text-r-3 truncate mt-[1px]">{client.phone}</p>}
            </div>
            <p className="text-[12px] text-r-2 truncate">{client.company || '—'}</p>
            <p className="text-[12px] text-r-3 capitalize">{client.source}</p>
            <StatusDropdown status={client.status} disabled={updatingStatus === client._id} onChange={(s) => handleStatusChange(client, s)} />
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => setEditing(client)} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-r-1 hover:bg-r-bg transition-all cursor-pointer" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <button onClick={() => setConfirmDelete(client)} disabled={deleting === client._id} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-[#F87171] hover:bg-r-bg transition-all cursor-pointer disabled:opacity-40" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-r-3">
            {search || statusFilter !== 'all' ? 'No clients match your filters.' : 'No clients yet. Add your first one!'}
          </div>
        ) : filtered.map((client) => (
          <div key={client._id} className="rounded-[12px] border border-r-border px-4 py-4" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={client.name} />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-r-1 truncate">{client.name}</p>
                  {client.company && <p className="text-[12px] text-r-3 truncate">{client.company}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <StatusDropdown status={client.status} disabled={updatingStatus === client._id} onChange={(s) => handleStatusChange(client, s)} />
                <button onClick={() => setEditing(client)} className="w-8 h-8 rounded-[6px] flex items-center justify-center text-r-3 hover:text-r-1 hover:bg-r-bg transition-all cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button onClick={() => setConfirmDelete(client)} disabled={deleting === client._id} className="w-8 h-8 rounded-[6px] flex items-center justify-center text-r-3 hover:text-[#F87171] hover:bg-r-bg transition-all cursor-pointer disabled:opacity-40">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                </button>
              </div>
            </div>
            {(client.email || client.phone) && (
              <div className="mt-3 pt-3 border-t border-r-border flex flex-col gap-1">
                {client.email && <p className="text-[12px] text-r-2">{client.email}</p>}
                {client.phone && <p className="text-[12px] text-r-3">{client.phone}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddClientModal onClose={() => setShowAdd(false)} onCreated={() => setShowAdd(false)} />
      )}
      {editing && (
        <EditClientModal client={editing} onClose={() => setEditing(null)} />
      )}
      {confirmDelete && (
        <ConfirmModal
          title="Delete client"
          message={`Are you sure you want to delete ${confirmDelete.name}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={!!deleting}
        />
      )}
    </div>
  );
}

function StatusDropdown({ status, onChange, disabled }: {
  status: string;
  onChange: (s: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const style = STATUS_STYLES[status] ?? { color: 'var(--text-3)', bg: 'rgba(136,153,170,0.10)' };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: 144, zIndex: 9999 });
    }
    setOpen((p) => !p);
  };

  return (
    <div className="inline-block">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[4px] text-[11px] font-medium cursor-pointer border-none outline-none transition-opacity disabled:opacity-50"
        style={{ background: style.bg, color: style.color }}
      >
        <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: style.color }} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && createPortal(
        <ul
          ref={menuRef}
          style={{ ...menuStyle, background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          className="rounded-[8px] border border-r-border overflow-hidden py-1"
        >
          {CLIENT_STATUS_OPTS.map((opt) => {
            const s = STATUS_STYLES[opt.value] ?? { color: 'var(--text-3)', bg: 'transparent' };
            return (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-[7px] text-[12px] cursor-pointer hover:bg-r-s2 transition-colors"
                style={{ color: s.color }}
              >
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
