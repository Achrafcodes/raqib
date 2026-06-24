import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import type { Invoice, Client, Project, InvoiceItem } from '../types';
import api from '../utils/api';

const STATUSES = ['draft', 'sent', 'paid', 'overdue'];
const emptyItem = (): InvoiceItem => ({ description: '', quantity: 1, unitPrice: 0, total: 0 });

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ clientId: '', projectId: '', status: 'draft', dueDate: '', tax: '0' });
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [inv, cli, proj] = await Promise.all([api.get('/api/invoices'), api.get('/api/clients'), api.get('/api/projects')]);
    setInvoices(inv.data.data); setClients(cli.data.data); setProjects(proj.data.data);
  };
  useEffect(() => { fetchData(); }, []);

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const updateItem = (i: number, k: keyof InvoiceItem, v: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [k]: v };
      if (k === 'quantity' || k === 'unitPrice') {
        updated[i].total = Number(updated[i].quantity) * Number(updated[i].unitPrice);
      }
      return updated;
    });
  };

  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const total = subtotal + subtotal * (Number(form.tax) / 100);

  const openCreate = () => { setForm({ clientId: '', projectId: '', status: 'draft', dueDate: '', tax: '0' }); setItems([emptyItem()]); setModal('create'); };
  const openEdit = (inv: Invoice) => {
    setSelected(inv);
    const cid = typeof inv.clientId === 'object' ? (inv.clientId as Client)._id : inv.clientId;
    const pid = inv.projectId && typeof inv.projectId === 'object' ? (inv.projectId as Project)._id : (inv.projectId ?? '');
    setForm({ clientId: cid, projectId: pid, status: inv.status, dueDate: inv.dueDate?.slice(0, 10) ?? '', tax: String(inv.tax) });
    setItems(inv.items);
    setModal('edit');
  };
  const openDelete = (inv: Invoice) => { setSelected(inv); setModal('delete'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, items, subtotal, total, tax: Number(form.tax) };
      if (modal === 'create') await api.post('/api/invoices', payload);
      else if (modal === 'edit') await api.put(`/api/invoices/${selected?._id}`, payload);
      await fetchData(); setModal(null);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await api.delete(`/api/invoices/${selected?._id}`); await fetchData(); setModal(null); }
    finally { setLoading(false); }
  };

  const getClientName = (inv: Invoice) => typeof inv.clientId === 'object' ? (inv.clientId as Client).name : '—';
  const getProjectTitle = (inv: Invoice) => inv.projectId && typeof inv.projectId === 'object' ? (inv.projectId as Project).title : '—';
  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-raqib-text">Invoices</h1>
          <p className="text-[12px] text-raqib-muted mt-0.5">{invoices.length} total invoices</p>
        </div>
        <Button onClick={openCreate}>+ New Invoice</Button>
      </div>

      <div className="flex items-center gap-1 mb-5">
        {['all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-[6px] capitalize transition-colors ${filter === s ? 'bg-raqib-surface text-raqib-text border border-raqib-border' : 'text-raqib-muted hover:text-raqib-text'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-raqib-surface border border-raqib-border rounded-[6px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-raqib-border">
              {['Invoice #', 'Client', 'Project', 'Total', 'Due Date', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[11px] font-medium text-raqib-muted uppercase tracking-widest px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-[13px] text-raqib-muted text-center">No invoices yet.</td></tr>}
            {filtered.map((inv) => (
              <tr key={inv._id} className="border-b border-raqib-border last:border-0 hover:bg-raqib-bg transition-colors">
                <td className="px-5 py-3 text-[13px] font-medium text-raqib-text">{inv.invoiceNumber}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-text">{getClientName(inv)}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{getProjectTitle(inv)}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-text">${inv.total.toLocaleString()}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(inv)} className="text-[12px] text-raqib-muted hover:text-raqib-text transition-colors">Edit</button>
                    <button onClick={() => openDelete(inv)} className="text-[12px] text-status-overdue hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'New Invoice' : 'Edit Invoice'} onClose={() => setModal(null)} width="max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Client</label>
                <select value={form.clientId} onChange={setField('clientId')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                  <option value="">Select client</option>
                  {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Project (optional)</label>
                <select value={form.projectId} onChange={setField('projectId')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                  <option value="">None</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Status</label>
                <select value={form.status} onChange={setField('status')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Input label="Due Date" type="date" value={form.dueDate} onChange={setField('dueDate')} />
            </div>

            <div>
              <p className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest mb-3">Line Items</p>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 items-center">
                    <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
                    <Input placeholder="Qty" type="number" value={String(item.quantity)} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} />
                    <Input placeholder="Unit price" type="number" value={String(item.unitPrice)} onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))} />
                    <p className="text-[13px] text-raqib-text text-right">${item.total.toFixed(0)}</p>
                    <button onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} className="text-raqib-muted hover:text-status-overdue text-[16px] transition-colors">×</button>
                  </div>
                ))}
                <button onClick={() => setItems((prev) => [...prev, emptyItem()])} className="text-[12px] text-raqib-accent hover:underline text-left mt-1">+ Add item</button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 border-t border-raqib-border pt-4">
              <div className="flex items-center gap-6">
                <span className="text-[12px] text-raqib-muted">Subtotal</span>
                <span className="text-[13px] text-raqib-text">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-raqib-muted">Tax %</span>
                <input type="number" value={form.tax} onChange={setField('tax')} className="w-16 bg-raqib-surface border border-raqib-border rounded-[6px] px-2 py-1 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent text-right" />
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[12px] font-medium text-raqib-text">Total</span>
                <span className="text-[15px] font-bold text-raqib-accent">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Invoice" onClose={() => setModal(null)}>
          <p className="text-[13px] text-raqib-muted mb-6">Delete invoice <span className="text-raqib-text font-medium">{selected?.invoiceNumber}</span>? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
