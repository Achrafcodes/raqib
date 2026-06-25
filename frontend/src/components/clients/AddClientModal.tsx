import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const SOURCE_OPTS = ['upwork', 'fiverr', 'instagram', 'referral', 'cold-email', 'other'].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
const STATUS_OPTS = ['lead', 'negotiating', 'active', 'done', 'lost'].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{6,20}$/;

type F = { name: string; email: string; phone: string; company: string; source: string; status: string; notes: string };
type Errs = Partial<Record<keyof F, string>>;

function validate(f: F): Errs {
  const e: Errs = {};
  if (!f.name.trim()) e.name = 'Name is required.';
  else if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!f.email.trim()) e.email = 'Email is required.';
  else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address.';
  if (!f.phone.trim()) e.phone = 'Phone is required.';
  else if (!PHONE_RE.test(f.phone)) e.phone = 'Enter a valid phone number.';
  if (!f.company.trim()) e.company = 'Company is required.';
  return e;
}

const BASE = 'w-full bg-r-bg border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none transition-colors';

function inputCls(touched: boolean, hasError: boolean) {
  return `${BASE} ${touched && hasError ? 'border-[var(--overdue)]' : 'border-r-border focus:border-r-accent'}`;
}

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

export default function AddClientModal({ onClose, onCreated }: Props) {
  const { refresh } = useRefresh();
  const [form, setForm] = useState<F>({ name: '', email: '', phone: '', company: '', source: 'other', status: 'lead', notes: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof F, boolean>>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validate(form);
  const set = (k: keyof F, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const touch = (k: keyof F) => setTouched((t) => ({ ...t, [k]: true }));
  const t = (k: keyof F) => !!touched[k];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true])) as Record<keyof F, boolean>;
    setTouched(allTouched);
    if (Object.keys(errors).length) return;
    setServerError('');
    setLoading(true);
    try {
      await api.post('/api/clients', form);
      refresh();
      onCreated();
      onClose();
    } catch {
      setServerError('Failed to create client. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Client" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *" error={errors.name} touched={t('name')}>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} onBlur={() => touch('name')} placeholder="Full name" className={inputCls(t('name'), !!errors.name)} />
          </Field>
          <Field label="Company *" error={errors.company} touched={t('company')}>
            <input value={form.company} onChange={(e) => set('company', e.target.value)} onBlur={() => touch('company')} placeholder="Company name" className={inputCls(t('company'), !!errors.company)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email *" error={errors.email} touched={t('email')}>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} onBlur={() => touch('email')} placeholder="client@email.com" className={inputCls(t('email'), !!errors.email)} />
          </Field>
          <Field label="Phone *" error={errors.phone} touched={t('phone')}>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} onBlur={() => touch('phone')} placeholder="+1 234 567 890" className={inputCls(t('phone'), !!errors.phone)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Source">
            <Select value={form.source} onChange={(v) => set('source', v)} options={SOURCE_OPTS} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(v) => set('status', v)} options={STATUS_OPTS} />
          </Field>
        </div>

        <Field label="Notes">
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any notes..." rows={3} className={`${BASE} border-r-border focus:border-r-accent resize-none`} />
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
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-[8px] text-[13px] font-semibold text-[#0C0E14] disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: 'var(--accent)' }}>
            {loading ? 'Adding…' : 'Add Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
