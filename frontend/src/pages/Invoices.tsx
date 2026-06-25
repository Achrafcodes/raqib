import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../utils/api';
import { useRefresh } from '../context/RefreshContext';
import type { Invoice } from '../types';
import AddInvoiceModal from '../components/invoices/AddInvoiceModal';
import ConfirmModal from '../components/ui/ConfirmModal';

const STATUSES = ['all', 'draft', 'sent', 'paid', 'overdue'];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  draft:   { color: 'var(--text-2)',  bg: 'rgba(148,163,184,0.10)' },
  sent:    { color: 'var(--lead)',    bg: 'var(--lead-bg)'         },
  paid:    { color: 'var(--paid)',    bg: 'var(--paid-bg)'         },
  overdue: { color: 'var(--overdue)', bg: 'var(--overdue-bg)'      },
};

const STATUS_OPTS = ['draft', 'sent', 'paid', 'overdue'].map((s) => ({
  value: s, label: s.charAt(0).toUpperCase() + s.slice(1),
}));

function clientName(inv: Invoice): string {
  if (!inv.clientId) return '—';
  if (typeof inv.clientId === 'object') return (inv.clientId as { name: string }).name;
  return '—';
}

function projectTitle(inv: Invoice): string {
  if (!inv.projectId) return '—';
  if (typeof inv.projectId === 'object') return (inv.projectId as { title: string }).title;
  return '—';
}

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(inv: Invoice) {
  if (inv.status === 'paid') return false;
  if (!inv.dueDate) return false;
  return new Date(inv.dueDate) < new Date();
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
      setMenuStyle({ position: 'fixed', top: r.bottom + 4, left: r.left, width: 120, zIndex: 9999 });
    }
    setOpen((p) => !p);
  };

  return (
    <div className="inline-block">
      <button ref={triggerRef} type="button" disabled={disabled} onClick={handleOpen}
        className="inline-flex items-center gap-[6px] px-2 py-[3px] rounded-[4px] text-[11px] font-medium cursor-pointer border-none outline-none disabled:opacity-50"
        style={{ background: style.bg, color: style.color }}>
        <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: style.color }} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
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

export default function Invoices() {
  const { tick, refresh } = useRefresh();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/invoices')
      .then((r) => setInvoices(r.data.data))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [tick]);

  const handleStatusChange = async (inv: Invoice, status: string) => {
    setUpdatingStatus(inv._id);
    try {
      const body: Record<string, unknown> = { status };
      if (status === 'paid') body.paidAt = new Date().toISOString();
      await api.put(`/api/invoices/${inv._id}`, body);
      setInvoices((prev) => prev.map((i) => i._id === inv._id ? { ...i, status: status as Invoice['status'], ...(status === 'paid' ? { paidAt: new Date().toISOString() } : {}) } : i));
      refresh();
    } catch { /* silent */ } finally { setUpdatingStatus(null); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(confirmDelete._id);
    try {
      await api.delete(`/api/invoices/${confirmDelete._id}`);
      setInvoices((prev) => prev.filter((i) => i._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch { /* silent */ } finally { setDeleting(null); }
  };

  const handleDownloadPDF = async (inv: Invoice) => {
    setDownloading(inv._id);
    try {
      const res = await api.get(`/api/invoices/${inv._id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${inv.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ } finally { setDownloading(null); }
  };

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalUnpaid = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || inv.invoiceNumber.toLowerCase().includes(q) || clientName(inv).toLowerCase().includes(q) || projectTitle(inv).toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 leading-tight">Invoices</h1>
          <p className="text-[13px] text-r-3 mt-[2px]">{invoices.length} total</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)' }}>
          <span className="text-[16px] leading-none">+</span>
          New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--paid)' },
          { label: 'Outstanding', value: `$${totalUnpaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--pending)' },
          { label: 'Overdue', value: invoices.filter((i) => i.status === 'overdue' || isOverdue(i)).length.toString(), color: 'var(--overdue)' },
        ].map((card) => (
          <div key={card.label} className="rounded-[12px] border border-r-border px-5 py-4" style={{ background: 'var(--surface)' }}>
            <p className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em] mb-1">{card.label}</p>
            <p className="text-[22px] font-bold tabular-nums" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices…"
          className="bg-r-surface border border-r-border rounded-[8px] px-3 py-[8px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors w-56" />
        <div className="flex items-center gap-1 bg-r-surface border border-r-border rounded-[8px] p-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-[5px] rounded-[6px] text-[12px] font-medium capitalize cursor-pointer transition-all ${statusFilter === s ? 'bg-r-accent text-[#0C0E14] font-semibold' : 'text-r-3 hover:text-r-1 hover:bg-r-s2'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[12px] border border-r-border overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="grid text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] px-5 py-3 border-b border-r-border"
          style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr 96px' }}>
          <span>Invoice</span>
          <span>Client / Project</span>
          <span>Amount</span>
          <span>Due Date</span>
          <span>Paid At</span>
          <span>Status</span>
          <span />
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-[13px] text-r-3">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-r-3">
            {search || statusFilter !== 'all' ? 'No invoices match your filters.' : 'No invoices yet. Create your first one!'}
          </div>
        ) : (
          filtered.map((inv, i) => (
            <div key={inv._id}
              className={`grid items-center px-5 py-4 hover:bg-r-s2 transition-colors ${i < filtered.length - 1 ? 'border-b border-r-border' : ''}`}
              style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr 96px' }}>

              {/* Invoice number */}
              <p className="text-[12px] font-mono font-semibold text-r-1">{inv.invoiceNumber}</p>

              {/* Client / Project */}
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-r-1 truncate">{clientName(inv)}</p>
                {inv.projectId && <p className="text-[11px] text-r-3 truncate mt-[1px]">{projectTitle(inv)}</p>}
              </div>

              {/* Amount */}
              <p className="text-[13px] font-semibold tabular-nums" style={{ color: inv.status === 'paid' ? 'var(--paid)' : 'var(--text-1)' }}>
                ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>

              {/* Due date */}
              <p className={`text-[12px] ${isOverdue(inv) ? '' : 'text-r-3'}`}
                style={isOverdue(inv) ? { color: 'var(--overdue)' } : undefined}>
                {formatDate(inv.dueDate)}
              </p>

              {/* Paid at */}
              <p className="text-[12px] text-r-3">{inv.paidAt ? formatDate(inv.paidAt) : '—'}</p>

              {/* Status dropdown */}
              <StatusDropdown status={inv.status} disabled={updatingStatus === inv._id} onChange={(s) => handleStatusChange(inv, s)} />

              {/* Actions */}
              <div className="flex items-center gap-1 justify-end">
                {/* Download PDF */}
                <button
                  onClick={() => handleDownloadPDF(inv)}
                  disabled={downloading === inv._id}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-r-1 hover:bg-r-bg transition-all cursor-pointer disabled:opacity-40"
                  title="Download PDF"
                >
                  {downloading === inv._id ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                </button>
                {inv.status !== 'paid' && (
                  <button
                    onClick={() => handleStatusChange(inv, 'paid')}
                    disabled={updatingStatus === inv._id}
                    className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-r-bg transition-all cursor-pointer disabled:opacity-40"
                    style={{ color: 'var(--paid)' }}
                    title="Mark as paid"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
                <button onClick={() => setConfirmDelete(inv)} disabled={deleting === inv._id}
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

      {showAdd && <AddInvoiceModal onClose={() => setShowAdd(false)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete invoice"
          message={`Delete ${confirmDelete.invoiceNumber}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={!!deleting}
        />
      )}
    </div>
  );
}
