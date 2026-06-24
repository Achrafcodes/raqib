import { useState, FormEvent } from 'react';
import Modal from '../ui/Modal';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const SOURCES = ['upwork', 'fiverr', 'instagram', 'referral', 'cold-email', 'other'];
const STATUSES = ['lead', 'negotiating', 'active', 'done', 'lost'];

export default function AddClientModal({ onClose, onCreated }: Props) {
  const { refresh } = useRefresh();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    source: 'other', status: 'lead', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/clients', form);
      refresh();
      onCreated();
      onClose();
    } catch {
      setError('Failed to create client. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Client" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name + Company */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *">
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" required className={INPUT} />
          </Field>
          <Field label="Company">
            <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company" className={INPUT} />
          </Field>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="client@email.com" className={INPUT} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 234 567 890" className={INPUT} />
          </Field>
        </div>

        {/* Source + Status */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Source">
            <select value={form.source} onChange={(e) => set('source', e.target.value)} className={INPUT}>
              {SOURCES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={INPUT}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </Field>
        </div>

        {/* Notes */}
        <Field label="Notes">
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any notes..." rows={3} className={INPUT + ' resize-none'} />
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
            {loading ? 'Adding…' : 'Add Client'}
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
