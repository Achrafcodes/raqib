import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';
import type { Client } from '../../types';

interface Props { onClose: () => void }

const STATUS_OPTS = ['not-started', 'in-progress', 'review', 'done', 'cancelled'].map((s) => ({
  value: s, label: s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
}));
const CURRENCY_OPTS = ['USD', 'EUR', 'GBP', 'MAD', 'CAD', 'AUD'].map((c) => ({ value: c, label: c }));

type F = { title: string; description: string; clientId: string; price: string; currency: string; status: string; deadline: string };
type Errs = Partial<Record<keyof F, string>>;

function validate(f: F): Errs {
  const e: Errs = {};
  if (!f.title.trim()) e.title = 'Title is required.';
  else if (f.title.trim().length < 2) e.title = 'Title must be at least 2 characters.';
  if (f.price && isNaN(parseFloat(f.price))) e.price = 'Enter a valid price.';
  if (f.price && parseFloat(f.price) < 0) e.price = 'Price cannot be negative.';
  return e;
}

const BASE = 'w-full bg-r-bg border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none transition-colors';
const inputCls = (touched: boolean, hasError: boolean) =>
  `${BASE} ${touched && hasError ? 'border-[var(--overdue)]' : 'border-r-border focus:border-r-accent'}`;

function FieldError({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-[5px] mt-[2px]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="text-[11px]" style={{ color: 'var(--overdue)' }}>{msg}</span>
    </div>
  );
}

function Field({ label, children, error, touched }: { label: string; children: React.ReactNode; error?: string; touched?: boolean }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
      {touched && error && <FieldError msg={error} />}
    </div>
  );
}

export default function AddProjectModal({ onClose }: Props) {
  const { refresh } = useRefresh();
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<F>({ title: '', description: '', clientId: '', price: '', currency: 'USD', status: 'not-started', deadline: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof F, boolean>>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/api/clients').then((r) => setClients(r.data.data)); }, []);

  const errors = validate(form);
  const set = (k: keyof F, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const touch = (k: keyof F) => setTouched((t) => ({ ...t, [k]: true }));
  const t = (k: keyof F) => !!touched[k];

  const clientOpts = [{ value: '', label: 'No client' }, ...clients.map((c) => ({ value: c._id, label: c.name }))];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])) as Record<keyof F, boolean>);
    if (Object.keys(errors).length) return;
    setServerError('');
    setLoading(true);
    try {
      await api.post('/api/projects', { ...form, price: parseFloat(form.price) || 0, clientId: form.clientId || undefined, deadline: form.deadline || undefined });
      refresh();
      onClose();
    } catch {
      setServerError('Failed to create project. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Title *" error={errors.title} touched={t('title')}>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} onBlur={() => touch('title')} placeholder="Project title" className={inputCls(t('title'), !!errors.title)} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Client">
            <Select value={form.clientId} onChange={(v) => set('clientId', v)} options={clientOpts} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(v) => set('status', v)} options={STATUS_OPTS} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price" error={errors.price} touched={t('price')}>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} onBlur={() => touch('price')} placeholder="0.00" className={inputCls(t('price'), !!errors.price)} />
          </Field>
          <Field label="Currency">
            <Select value={form.currency} onChange={(v) => set('currency', v)} options={CURRENCY_OPTS} />
          </Field>
        </div>

        <Field label="Deadline">
          <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={`${BASE} border-r-border focus:border-r-accent`} />
        </Field>

        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What's this project about?" rows={3} className={`${BASE} border-r-border focus:border-r-accent resize-none`} />
        </Field>

        {serverError && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-[8px] border" style={{ background: 'var(--overdue-bg)', borderColor: 'rgba(248,113,113,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[1px]">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[12px]" style={{ color: 'var(--overdue)' }}>{serverError}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-[8px] text-[13px] font-semibold text-[#0C0E14] disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: 'var(--accent)' }}>
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
