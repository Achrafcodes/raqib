import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import type { Reminder, Client } from '../types';
import api from '../utils/api';

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Reminder | null>(null);
  const [form, setForm] = useState({ clientId: '', title: '', note: '', dueDate: '' });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [r, c] = await Promise.all([api.get('/api/reminders'), api.get('/api/clients')]);
    setReminders(r.data.data); setClients(c.data.data);
  };
  useEffect(() => { fetchData(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const openCreate = () => { setForm({ clientId: '', title: '', note: '', dueDate: '' }); setModal('create'); };
  const openEdit = (r: Reminder) => {
    setSelected(r);
    const cid = r.clientId && typeof r.clientId === 'object' ? (r.clientId as Client)._id : (r.clientId ?? '');
    setForm({ clientId: cid, title: r.title, note: r.note, dueDate: r.dueDate?.slice(0, 10) ?? '' });
    setModal('edit');
  };
  const openDelete = (r: Reminder) => { setSelected(r); setModal('delete'); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/api/reminders', form);
      else if (modal === 'edit') await api.put(`/api/reminders/${selected?._id}`, form);
      await fetchData(); setModal(null);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try { await api.delete(`/api/reminders/${selected?._id}`); await fetchData(); setModal(null); }
    finally { setLoading(false); }
  };

  const handleMarkDone = async (id: string) => {
    await api.patch(`/api/reminders/${id}/done`); await fetchData();
  };

  const getClientName = (r: Reminder) => r.clientId && typeof r.clientId === 'object' ? (r.clientId as Client).name : '—';

  const filtered = filter === 'all' ? reminders :
    filter === 'done' ? reminders.filter((r) => r.isDone) :
    reminders.filter((r) => !r.isDone);

  const isOverdue = (r: Reminder) => !r.isDone && new Date(r.dueDate) < new Date();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-raqib-text">Reminders</h1>
          <p className="text-[12px] text-raqib-muted mt-0.5">{reminders.filter((r) => !r.isDone).length} pending</p>
        </div>
        <Button onClick={openCreate}>+ New Reminder</Button>
      </div>

      <div className="flex items-center gap-1 mb-5">
        {(['all', 'pending', 'done'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-[6px] capitalize transition-colors ${filter === s ? 'bg-raqib-surface text-raqib-text border border-raqib-border' : 'text-raqib-muted hover:text-raqib-text'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="bg-raqib-surface border border-raqib-border rounded-[6px] px-5 py-8 text-center">
            <p className="text-[13px] text-raqib-muted">No reminders yet.</p>
          </div>
        )}
        {filtered.map((r) => (
          <div key={r._id} className={`bg-raqib-surface border rounded-[6px] px-5 py-4 flex items-center justify-between ${isOverdue(r) ? 'border-status-overdue/40' : 'border-raqib-border'}`}>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={r.isDone}
                onChange={() => !r.isDone && handleMarkDone(r._id)}
                className="w-4 h-4 accent-[#4ADE80] cursor-pointer"
              />
              <div>
                <p className={`text-[13px] font-medium ${r.isDone ? 'line-through text-raqib-muted' : 'text-raqib-text'}`}>{r.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[11px] text-raqib-muted">{getClientName(r)}</p>
                  {r.note && <p className="text-[11px] text-raqib-muted">· {r.note}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`text-[12px] ${isOverdue(r) ? 'text-status-overdue' : 'text-raqib-muted'}`}>
                {new Date(r.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => openEdit(r)} className="text-[12px] text-raqib-muted hover:text-raqib-text transition-colors">Edit</button>
                <button onClick={() => openDelete(r)} className="text-[12px] text-status-overdue hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'New Reminder' : 'Edit Reminder'} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Title" value={form.title} onChange={set('title')} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Client (optional)</label>
              <select value={form.clientId} onChange={set('clientId')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                <option value="">None</option>
                {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Note (optional)</label>
              <textarea value={form.note} onChange={set('note')} rows={3} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text placeholder:text-raqib-muted focus:outline-none focus:border-raqib-accent resize-none transition-colors" />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Reminder" onClose={() => setModal(null)}>
          <p className="text-[13px] text-raqib-muted mb-6">Delete <span className="text-raqib-text font-medium">"{selected?.title}"</span>? This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
