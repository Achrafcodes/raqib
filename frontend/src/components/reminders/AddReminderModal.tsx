import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import DateTimePicker from '../ui/DateTimePicker';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client } from '../../types';

interface Props { onClose: () => void }

const INPUT = 'w-full bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
    </div>
  );
}

export default function AddReminderModal({ onClose }: Props) {
  const { refresh } = useRefresh();
  const [clients, setClients] = useState<Client[]>([]);

  const defaultDue = (() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  })();

  const [form, setForm] = useState({ title: '', note: '', clientId: '', dueDate: defaultDue });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/clients').then((res) => setClients(res.data.data));
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.dueDate) { setError('Due date is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/reminders', {
        ...form,
        clientId: form.clientId || undefined,
      });
      refresh();
      onClose();
    } catch {
      setError('Failed to create reminder. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Reminder" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Title *">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Follow up with client" required className={INPUT} />
        </Field>

        <Field label="Client">
          <select value={form.clientId} onChange={(e) => set('clientId', e.target.value)} className={INPUT}>
            <option value="">No client</option>
            {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Due Date *">
          <DateTimePicker value={form.dueDate} onChange={(v) => set('dueDate', v)} />
        </Field>

        <Field label="Note">
          <textarea value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Any additional notes..." rows={3} className={INPUT + ' resize-none'} />
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
            {loading ? 'Adding…' : 'Add Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
