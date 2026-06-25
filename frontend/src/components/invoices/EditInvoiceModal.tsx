import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client, Invoice, Project } from '../../types';

interface Props { invoice: Invoice; onClose: () => void }
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

function resolveId(val: { _id: string } | string | null | undefined): string {
  if (!val) return '';
  if (typeof val === 'object') return val._id;
  return val;
}

export default function EditInvoiceModal({ invoice, onClose }: Props) {
  const { refresh } = useRefresh();

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [clientId, setClientId] = useState(resolveId(invoice.clientId as { _id: string } | string));
  const [projectId, setProjectId] = useState(resolveId(invoice.projectId as { _id: string } | string | null));
  const [status, setStatus] = useState(invoice.status);
  const [dueDate, setDueDate] = useState(invoice.dueDate ? invoice.dueDate.slice(0, 10) : '');
  const [tax, setTax] = useState(String(invoice.tax ?? 0));
  const [items, setItems] = useState<LineItem[]>(
    invoice.items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/clients').then((res) => setClients(res.data.data));
  }, []);

  useEffect(() => {
    if (!clientId) { setProjects([]); return; }
    api.get('/api/projects').then((res) => {
      const all: Project[] = res.data.data;
      setProjects(all.filter((p) =>
        typeof p.clientId === 'object' ? (p.clientId as { _id: string })._id === clientId : p.clientId === clientId
      ));
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
      const body: Record<string, unknown> = {
        clientId,
        projectId: projectId || undefined,
        status,
        dueDate: dueDate || undefined,
        tax: parseFloat(tax) || 0,
        items: items.map((it) => ({ ...it, total: it.quantity * it.unitPrice })),
        subtotal,
        total,
      };
      if (status === 'paid' && invoice.status !== 'paid') {
        body.paidAt = new Date().toISOString();
      }
      await api.put(`/api/invoices/${invoice._id}`, body);
      refresh();
      onClose();
    } catch {
      setError('Failed to update invoice. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Edit ${invoice.invoiceNumber}`} onClose={onClose}>
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
            <Select value={status} onChange={(v) => setStatus(v as Invoice['status'])} options={STATUS_OPTS} />
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
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
