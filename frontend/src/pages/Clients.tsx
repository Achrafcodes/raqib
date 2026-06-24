import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import type { Client } from '../types';
import api from '../utils/api';

const SOURCES = ['upwork', 'fiverr', 'instagram', 'referral', 'cold-email', 'other'];
const STATUSES = ['lead', 'negotiating', 'active', 'done', 'lost'];

const empty = { name: '', email: '', phone: '', company: '', source: 'other', status: 'lead', notes: '' };

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const fetchClients = () => api.get('/api/clients').then((r) => setClients(r.data.data));
  useEffect(() => { fetchClients(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm(empty); setModal('create'); };
  const openEdit = (c: Client) => { setSelected(c); setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, source: c.source, status: c.status, notes: c.notes }); setModal('edit'); };
  const openDelete = (c: Client) => { setSelected(c); setModal('delete'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/api/clients', form);
      else if (modal === 'edit') await api.put(`/api/clients/${selected?._id}`, form);
      await fetchClients();
      setModal(null);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/clients/${selected?._id}`);
      await fetchClients();
      setModal(null);
    } finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? clients : clients.filter((c) => c.status === filter);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-raqib-text">Clients</h1>
          <p className="text-[12px] text-raqib-muted mt-0.5">{clients.length} total clients</p>
        </div>
        <Button onClick={openCreate}>+ New Client</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-[6px] capitalize transition-colors ${
              filter === s ? 'bg-raqib-surface text-raqib-text border border-raqib-border' : 'text-raqib-muted hover:text-raqib-text'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-raqib-surface border border-raqib-border rounded-[6px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-raqib-border">
              {['Client', 'Company', 'Source', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[11px] font-medium text-raqib-muted uppercase tracking-widest px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-[13px] text-raqib-muted text-center">No clients yet. Add your first client.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c._id} className="border-b border-raqib-border last:border-0 hover:bg-raqib-bg transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.name} size="sm" />
                    <div>
                      <p className="text-[13px] font-medium text-raqib-text">{c.name}</p>
                      <p className="text-[11px] text-raqib-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{c.company || '—'}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted capitalize">{c.source}</td>
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(c)} className="text-[12px] text-raqib-muted hover:text-raqib-text transition-colors">Edit</button>
                    <button onClick={() => openDelete(c)} className="text-[12px] text-status-overdue hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'New Client' : 'Edit Client'} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={set('name')} required />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} />
            <Input label="Phone" value={form.phone} onChange={set('phone')} />
            <Input label="Company" value={form.company} onChange={set('company')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Source</label>
              <select value={form.source} onChange={set('source')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Status</label>
              <select value={form.status} onChange={set('status')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Client" onClose={() => setModal(null)}>
          <p className="text-[13px] text-raqib-muted mb-6">
            Delete <span className="text-raqib-text font-medium">{selected?.name}</span>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
