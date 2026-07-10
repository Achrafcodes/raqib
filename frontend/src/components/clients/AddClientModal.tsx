import { useState, useRef, useEffect } from 'react';
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

const COUNTRY_CODES = [
  { code: '+1',   flag: '🇺🇸', name: 'US' },
  { code: '+1',   flag: '🇨🇦', name: 'CA' },
  { code: '+44',  flag: '🇬🇧', name: 'GB' },
  { code: '+33',  flag: '🇫🇷', name: 'FR' },
  { code: '+49',  flag: '🇩🇪', name: 'DE' },
  { code: '+39',  flag: '🇮🇹', name: 'IT' },
  { code: '+34',  flag: '🇪🇸', name: 'ES' },
  { code: '+31',  flag: '🇳🇱', name: 'NL' },
  { code: '+46',  flag: '🇸🇪', name: 'SE' },
  { code: '+47',  flag: '🇳🇴', name: 'NO' },
  { code: '+45',  flag: '🇩🇰', name: 'DK' },
  { code: '+358', flag: '🇫🇮', name: 'FI' },
  { code: '+41',  flag: '🇨🇭', name: 'CH' },
  { code: '+43',  flag: '🇦🇹', name: 'AT' },
  { code: '+32',  flag: '🇧🇪', name: 'BE' },
  { code: '+351', flag: '🇵🇹', name: 'PT' },
  { code: '+48',  flag: '🇵🇱', name: 'PL' },
  { code: '+7',   flag: '🇷🇺', name: 'RU' },
  { code: '+380', flag: '🇺🇦', name: 'UA' },
  { code: '+90',  flag: '🇹🇷', name: 'TR' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+972', flag: '🇮🇱', name: 'IL' },
  { code: '+91',  flag: '🇮🇳', name: 'IN' },
  { code: '+92',  flag: '🇵🇰', name: 'PK' },
  { code: '+880', flag: '🇧🇩', name: 'BD' },
  { code: '+94',  flag: '🇱🇰', name: 'LK' },
  { code: '+86',  flag: '🇨🇳', name: 'CN' },
  { code: '+81',  flag: '🇯🇵', name: 'JP' },
  { code: '+82',  flag: '🇰🇷', name: 'KR' },
  { code: '+65',  flag: '🇸🇬', name: 'SG' },
  { code: '+60',  flag: '🇲🇾', name: 'MY' },
  { code: '+62',  flag: '🇮🇩', name: 'ID' },
  { code: '+63',  flag: '🇵🇭', name: 'PH' },
  { code: '+66',  flag: '🇹🇭', name: 'TH' },
  { code: '+84',  flag: '🇻🇳', name: 'VN' },
  { code: '+61',  flag: '🇦🇺', name: 'AU' },
  { code: '+64',  flag: '🇳🇿', name: 'NZ' },
  { code: '+55',  flag: '🇧🇷', name: 'BR' },
  { code: '+54',  flag: '🇦🇷', name: 'AR' },
  { code: '+52',  flag: '🇲🇽', name: 'MX' },
  { code: '+57',  flag: '🇨🇴', name: 'CO' },
  { code: '+56',  flag: '🇨🇱', name: 'CL' },
  { code: '+51',  flag: '🇵🇪', name: 'PE' },
  { code: '+58',  flag: '🇻🇪', name: 'VE' },
  { code: '+20',  flag: '🇪🇬', name: 'EG' },
  { code: '+27',  flag: '🇿🇦', name: 'ZA' },
  { code: '+234', flag: '🇳🇬', name: 'NG' },
  { code: '+254', flag: '🇰🇪', name: 'KE' },
  { code: '+212', flag: '🇲🇦', name: 'MA' },
  { code: '+213', flag: '🇩🇿', name: 'DZ' },
  { code: '+216', flag: '🇹🇳', name: 'TN' },
];

function CountryCodePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRY_CODES.find((c) => c.code === value && c.name === COUNTRY_CODES.find(x => x.code === value)?.name) ?? COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0];

  const filtered = search
    ? COUNTRY_CODES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search))
    : COUNTRY_CODES;

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (c: typeof COUNTRY_CODES[0]) => {
    onChange(c.code);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-[6px] h-full px-3 rounded-l-[8px] border border-r-border bg-r-bg text-[13px] text-r-1 hover:border-r-accent transition-colors cursor-pointer whitespace-nowrap"
        style={{ borderRight: 'none' }}
      >
        <span className="text-[16px] leading-none">{selected?.flag}</span>
        <span className="text-r-3 text-[12px]">{value}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-50 rounded-[8px] overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', width: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-r-bg border border-r-border rounded-[6px] px-2 py-[5px] text-[12px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent"
            />
          </div>
          <div className="overflow-y-auto max-h-[200px]">
            {filtered.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => select(c)}
                className="flex items-center gap-2 w-full px-3 py-[7px] text-left hover:bg-r-s2 transition-colors cursor-pointer"
              >
                <span className="text-[15px]">{c.flag}</span>
                <span className="text-[12px] text-r-1 font-medium">{c.name}</span>
                <span className="text-[11px] text-r-3 ml-auto">{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-[12px] text-r-3 px-3 py-3">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type F = { name: string; email: string; countryCode: string; phoneNumber: string; company: string; source: string; status: string; notes: string };
type Errs = Partial<Record<keyof F, string>>;

function validate(f: F): Errs {
  const e: Errs = {};
  if (!f.name.trim()) e.name = 'Name is required.';
  else if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!f.email.trim()) e.email = 'Email is required.';
  else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address.';
  if (!f.phoneNumber.trim()) e.phoneNumber = 'Phone is required.';
  else if (!/^[\d\s\-().]{4,15}$/.test(f.phoneNumber)) e.phoneNumber = 'Enter a valid phone number.';
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
  const [form, setForm] = useState<F>({ name: '', email: '', countryCode: '+1', phoneNumber: '', company: '', source: 'other', status: 'lead', notes: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof F, boolean>>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validate(form);
  const set = (k: keyof F, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const t = (k: keyof F) => !!touched[k];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true])) as Record<keyof F, boolean>;
    setTouched(allTouched);
    if (Object.keys(errors).length) return;
    setServerError('');
    setLoading(true);
    try {
      const phone = `${form.countryCode} ${form.phoneNumber}`;
      await api.post('/api/clients', { ...form, phone });
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
    <Modal title="New Client" onClose={onClose} width={620}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *" error={errors.name} touched={t('name')}>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" className={inputCls(t('name'), !!errors.name)} />
          </Field>
          <Field label="Company *" error={errors.company} touched={t('company')}>
            <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" className={inputCls(t('company'), !!errors.company)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email *" error={errors.email} touched={t('email')}>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="client@email.com" className={inputCls(t('email'), !!errors.email)} />
          </Field>
          <Field label="Phone *" error={errors.phoneNumber} touched={t('phoneNumber')}>
            <div className="flex">
              <CountryCodePicker value={form.countryCode} onChange={(v) => set('countryCode', v)} />
              <input
                value={form.phoneNumber}
                onChange={(e) => set('phoneNumber', e.target.value)}
                placeholder="234 567 890"
                className={`flex-1 bg-r-bg border py-[9px] px-3 text-[13px] text-r-1 placeholder:text-r-3 outline-none transition-colors rounded-r-[8px] ${t('phoneNumber') && errors.phoneNumber ? 'border-[var(--overdue)]' : 'border-r-border focus:border-r-accent'}`}
              />
            </div>
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
