import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import type { Project, Client } from '../types';
import api from '../utils/api';

const STATUSES = ['not-started', 'in-progress', 'review', 'done', 'cancelled'];
const empty = { clientId: '', title: '', description: '', price: '', currency: 'USD', status: 'not-started', deadline: '' };

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [p, c] = await Promise.all([api.get('/api/projects'), api.get('/api/clients')]);
    setProjects(p.data.data);
    setClients(c.data.data);
  };
  useEffect(() => { fetchData(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm(empty); setModal('create'); };
  const openEdit = (p: Project) => {
    setSelected(p);
    const cid = typeof p.clientId === 'object' ? (p.clientId as Client)._id : p.clientId;
    setForm({ clientId: cid, title: p.title, description: p.description, price: String(p.price), currency: p.currency, status: p.status, deadline: p.deadline?.slice(0, 10) ?? '' });
    setModal('edit');
  };
  const openDelete = (p: Project) => { setSelected(p); setModal('delete'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (modal === 'create') await api.post('/api/projects', payload);
      else if (modal === 'edit') await api.put(`/api/projects/${selected?._id}`, payload);
      await fetchData();
      setModal(null);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await api.delete(`/api/projects/${selected?._id}`); await fetchData(); setModal(null); }
    finally { setLoading(false); }
  };

  const getClientName = (p: Project) => typeof p.clientId === 'object' ? (p.clientId as Client).name : '—';
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-raqib-text">Projects</h1>
          <p className="text-[12px] text-raqib-muted mt-0.5">{projects.length} total projects</p>
        </div>
        <Button onClick={openCreate}>+ New Project</Button>
      </div>

      <div className="flex items-center gap-1 mb-5">
        {['all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-[6px] transition-colors ${filter === s ? 'bg-raqib-surface text-raqib-text border border-raqib-border' : 'text-raqib-muted hover:text-raqib-text'}`}>
            {s === 'all' ? 'All' : s.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-raqib-surface border border-raqib-border rounded-[6px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-raqib-border">
              {['Project', 'Client', 'Price', 'Deadline', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[11px] font-medium text-raqib-muted uppercase tracking-widest px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-[13px] text-raqib-muted text-center">No projects yet.</td></tr>}
            {filtered.map((p) => (
              <tr key={p._id} className="border-b border-raqib-border last:border-0 hover:bg-raqib-bg transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.title} size="sm" />
                    <p className="text-[13px] font-medium text-raqib-text">{p.title}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{getClientName(p)}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-text">${p.price.toLocaleString()}</td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(p)} className="text-[12px] text-raqib-muted hover:text-raqib-text transition-colors">Edit</button>
                    <button onClick={() => openDelete(p)} className="text-[12px] text-status-overdue hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Client</label>
              <select value={form.clientId} onChange={set('clientId')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                <option value="">Select client</option>
                {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Title" value={form.title} onChange={set('title')} required />
            <Input label="Price ($)" type="number" value={form.price} onChange={set('price')} required />
            <Input label="Deadline" type="date" value={form.deadline} onChange={set('deadline')} />
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
        <Modal title="Delete Project" onClose={() => setModal(null)}>
          <p className="text-[13px] text-raqib-muted mb-6">Delete <span className="text-raqib-text font-medium">{selected?.title}</span>? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
