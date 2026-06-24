import { useState, useEffect, FormEvent } from 'react';
import Modal from '../ui/Modal';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client } from '../../types';

interface Props { onClose: () => void }

const INPUT = 'w-full bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors';
const SEL = 'bg-r-bg border border-r-border rounded-[8px] px-2 py-[9px] text-[13px] text-r-1 outline-none focus:border-r-accent transition-colors text-center cursor-pointer';

function DuePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const d = value ? new Date(value) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();

  const update = (y: number, mo: number, da: number, h: number, mi: number) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    onChange(`${y}-${pad(mo)}-${pad(da)}T${pad(h)}:${pad(mi)}`);
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const currentYear = new Date().getFullYear();
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="flex items-center gap-[6px]">
      {/* Day */}
      <select value={day} onChange={(e) => update(year, month, +e.target.value, hour, minute)} className={SEL + ' w-[58px]'}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{String(d).padStart(2,'0')}</option>
        ))}
      </select>
      <span className="text-r-3 text-[13px]">/</span>
      {/* Month */}
      <select value={month} onChange={(e) => update(year, +e.target.value, Math.min(day, new Date(year, +e.target.value, 0).getDate()), hour, minute)} className={SEL + ' w-[58px]'}>
        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
      </select>
      <span className="text-r-3 text-[13px]">/</span>
      {/* Year */}
      <select value={year} onChange={(e) => update(+e.target.value, month, day, hour, minute)} className={SEL + ' w-[72px]'}>
        {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="text-r-3 text-[13px] mx-1">@</span>
      {/* Hour */}
      <select value={hour} onChange={(e) => update(year, month, day, +e.target.value, minute)} className={SEL + ' w-[52px]'}>
        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
          <option key={h} value={h}>{String(h).padStart(2,'0')}</option>
        ))}
      </select>
      <span className="text-r-3 text-[13px]">:</span>
      {/* Minute */}
      <select value={minute} onChange={(e) => update(year, month, day, hour, +e.target.value)} className={SEL + ' w-[52px]'}>
        {[0, 15, 30, 45].map((m) => (
          <option key={m} value={m}>{String(m).padStart(2,'0')}</option>
        ))}
      </select>
    </div>
  );
}

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

        {/* Due date — day / month / year + hour : minute */}
        <Field label="Due Date *">
          <DuePicker value={form.dueDate} onChange={(v) => set('dueDate', v)} />
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
