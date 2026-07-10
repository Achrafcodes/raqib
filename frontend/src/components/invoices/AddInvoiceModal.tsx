import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client, Project } from '../../types';

interface Props { onClose: () => void }
interface LineItem { description: string; quantity: number; unitPrice: number }

const INPUT = 'w-full bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors';

const STATUS_OPTS = ['draft', 'sent', 'paid', 'overdue'].map((s) => ({
  value: s, label: s.charAt(0).toUpperCase() + s.slice(1),
}));

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
    </div>
  );
}

function SuccessPrompt({ invoiceId, onClose }: { invoiceId: string; onClose: () => void }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/api/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setSendError('');
    try {
      await api.post(`/api/invoices/${invoiceId}/send`);
      setSent(true);
    } catch {
      setSendError('Failed to send email. Try again.');
    } finally {
      setSending(false);
    }
  };

  const handleGoToInvoices = () => {
    onClose();
    navigate('/invoices');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-[380px] rounded-[12px] p-6 flex flex-col gap-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.12)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-bold text-r-1">Invoice created</p>
            <p className="text-[12px] text-r-3 mt-[3px]">What would you like to do next?</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">{downloading ? 'Downloading…' : 'Download PDF'}</p>
              <p className="text-[11px] text-r-3">Save invoice as a PDF file</p>
            </div>
          </button>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sent ? 'var(--accent)' : 'var(--text-2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sent
                ? <polyline points="20 6 9 17 4 12" />
                : <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>}
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">{sending ? 'Sending…' : sent ? 'Sent!' : 'Send by email'}</p>
              <p className="text-[11px] text-r-3">{sent ? 'Invoice emailed to client' : 'Email PDF directly to client'}</p>
            </div>
          </button>

          {sendError && <p className="text-[11px] px-1" style={{ color: 'var(--overdue)' }}>{sendError}</p>}

          <button
            onClick={handleGoToInvoices}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">Go to Invoices</p>
              <p className="text-[11px] text-r-3">View and manage all invoices</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-[12px] text-r-3 hover:text-r-1 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function AddInvoiceModal({ onClose }: Props) {
  const { refresh } = useRefresh();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('draft');
  const [dueDate, setDueDate] = useState('');
  const [tax, setTax] = useState('0');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/clients').then((res) => setClients(res.data.data));
  }, []);

  useEffect(() => {
    if (!clientId) { setProjects([]); setProjectId(''); return; }
    api.get('/api/projects').then((res) => {
      const all: Project[] = res.data.data;
      const clientProjects = all.filter((p) =>
        typeof p.clientId === 'object' ? (p.clientId as { _id: string })._id === clientId : p.clientId === clientId
      );
      setProjects(clientProjects);
      setProjectId('');
    });
  }, [clientId]);

  const clientOpts = [
    { value: '', label: 'Select client' },
    ...clients.map((c) => ({ value: c._id, label: c.name })),
  ];
  const projectOpts = [
    { value: '', label: 'No project' },
    ...projects.map((p) => ({ value: p._id, label: p.title })),
  ];

  const setItem = (i: number, k: keyof LineItem, v: string) => {
    setItems((prev) => prev.map((item, idx) =>
      idx === i ? { ...item, [k]: k === 'description' ? v : parseFloat(v) || 0 } : item
    ));
  };

  const addItem = () => setItems((p) => [...p, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const taxAmount = subtotal * (parseFloat(tax) || 0) / 100;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientId) { setError('Please select a client.'); return; }
    if (items.some((it) => !it.description.trim())) { setError('All line items need a description.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/invoices', {
        clientId,
        projectId: projectId || undefined,
        status,
        dueDate: dueDate || undefined,
        tax: parseFloat(tax) || 0,
        items: items.map((it) => ({ ...it, total: it.quantity * it.unitPrice })),
        subtotal,
        total,
      });
      refresh();
      setCreatedId(res.data.data._id);
    } catch {
      setError('Failed to create invoice. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (createdId) {
    return <SuccessPrompt invoiceId={createdId} onClose={onClose} />;
  }

  return (
    <Modal title="New Invoice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Client *">
            <Select value={clientId} onChange={setClientId} options={clientOpts} />
          </Field>
          <Field label="Project">
            <Select value={projectId} onChange={setProjectId} options={projectOpts} disabled={!clientId} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={status} onChange={setStatus} options={STATUS_OPTS} />
          </Field>
          <Field label="Due Date">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={INPUT} />
          </Field>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em]">Line Items</label>
            <button type="button" onClick={addItem} className="text-[11px] font-medium text-r-accent hover:opacity-80 cursor-pointer">+ Add item</button>
          </div>
          <div className="grid grid-cols-[1fr_60px_80px_24px] gap-2 px-1">
            {['Description', 'Qty', 'Price', ''].map((h) => (
              <span key={h} className="text-[9px] font-semibold text-r-3 uppercase tracking-[0.08em]">{h}</span>
            ))}
          </div>
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_60px_80px_24px] gap-2 items-center">
              <input value={item.description} onChange={(e) => setItem(i, 'description', e.target.value)} placeholder="Description" className={INPUT} />
              <input type="number" min="1" value={item.quantity} onChange={(e) => setItem(i, 'quantity', e.target.value)} className={INPUT + ' text-center'} />
              <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => setItem(i, 'unitPrice', e.target.value)} className={INPUT} />
              <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1} className="text-r-3 hover:text-[var(--overdue)] transition-colors cursor-pointer disabled:opacity-30 text-[16px] leading-none">×</button>
            </div>
          ))}
        </div>

        {/* Tax + Totals */}
        <div className="flex flex-col gap-2 border-t border-r-border pt-3 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-r-3">Subtotal</span>
            <span className="text-[12px] font-medium text-r-1">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-r-3">Tax</span>
              <input type="number" min="0" max="100" step="0.5" value={tax} onChange={(e) => setTax(e.target.value)} className="w-[56px] bg-r-bg border border-r-border rounded-[6px] px-2 py-[4px] text-[12px] text-r-1 outline-none focus:border-r-accent text-center" />
              <span className="text-[12px] text-r-3">%</span>
            </div>
            <span className="text-[12px] font-medium text-r-1">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-r-border pt-2">
            <span className="text-[13px] font-semibold text-r-1">Total</span>
            <span className="text-[15px] font-bold tabular-nums" style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="text-[12px]" style={{ color: 'var(--overdue)' }}>{error}</p>}

        <div className="flex justify-end gap-2 mt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-[8px] text-[13px] font-semibold text-[#0C0E14] disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: 'var(--accent)' }}>
            {loading ? 'Creating…' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
