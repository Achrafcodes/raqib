import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client } from '../../types';

interface Props {
  onClose: () => void;
}

const STATUSES = ['not-started', 'in-progress', 'review', 'done', 'cancelled'];

export default function AddProjectModal({ onClose }: Props) {
  const { refresh } = useRefresh();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', clientId: '',
    price: '', currency: 'USD', status: 'not-started', deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/clients').then((res) => setClients(res.data.data));
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/projects', {
        ...form,
        price: parseFloat(form.price) || 0,
        clientId: form.clientId || undefined,
        deadline: form.deadline || undefined,
      });
      refresh();
      onClose();
    } catch {
      setError('Failed to create project. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <Field label="Title *">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project title" required className={INPUT} />
        </Field>

        {/* Client + Status */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Client">
            <select value={form.clientId} onChange={(e) => set('clientId', e.target.value)} className={INPUT}>
              <option value="">No client</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={INPUT}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}</option>)}
            </select>
          </Field>
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price">
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0.00" className={INPUT} />
          </Field>
          <Field label="Currency">
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={INPUT}>
              {['USD', 'EUR', 'GBP', 'MAD', 'CAD', 'AUD'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        {/* Deadline */}
        <Field label="Deadline">
          <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={INPUT} />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What's this project about?" rows={3} className={INPUT + ' resize-none'} />
        </Field>

        {error && <p className="text-[12px]" style={{ color: 'var(--overdue)' }}>{error}</p>}

        <div className="flex justify-end gap-2 mt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-[8px] text-[13px] font-semibold text-[#0C0E14] disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const INPUT = 'w-full bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
    </div>
  );
}
