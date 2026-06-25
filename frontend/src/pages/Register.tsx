import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OAuthButtons from '../components/ui/OAuthButtons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^.{2,}$/;
const PASSWORD_RE = /^.{8,}$/;

type Fields = { name: string; email: string; password: string; freelanceTitle: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const errs: Errors = {};
  if (!f.name.trim()) errs.name = 'Full name is required.';
  else if (!NAME_RE.test(f.name.trim())) errs.name = 'Name must be at least 2 characters.';
  if (!f.email.trim()) errs.email = 'Email is required.';
  else if (!EMAIL_RE.test(f.email)) errs.email = 'Enter a valid email address.';
  if (!f.password) errs.password = 'Password is required.';
  else if (!PASSWORD_RE.test(f.password)) errs.password = 'Password must be at least 8 characters.';
  return errs;
}

const BASE = 'bg-r-surface border rounded-[8px] px-4 py-3 text-[13px] text-r-1 placeholder:text-r-3 outline-none transition-colors w-full';

function Field({
  label, children, error, touched, hint,
}: { label: string; children: React.ReactNode; error?: string; touched: boolean; hint?: string }) {
  const showError = touched && error;
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
      {showError ? (
        <div className="flex items-center gap-[6px] mt-[2px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[11px]" style={{ color: 'var(--overdue)' }}>{error}</span>
        </div>
      ) : hint && !touched ? (
        <span className="text-[11px] text-r-3 mt-[2px]">{hint}</span>
      ) : null}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<Fields>({ name: '', email: '', password: '', freelanceTitle: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validate(form);
  const set = (k: keyof Fields, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const touch = (field: keyof Fields) => setTouched((t) => ({ ...t, [field]: true }));

  const inputClass = (field: keyof Fields) =>
    `${BASE} ${touched[field] && errors[field] ? 'border-[var(--overdue)]' : 'border-r-border focus:border-r-accent'}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, freelanceTitle: true });
    if (Object.keys(errors).length) return;
    setServerError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch {
      setServerError('Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-r-bg px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}>
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <polyline points="1,13 5,9 8,11 12,5 16,7 21,1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="21" cy="1" r="2" fill="#4ADE80" />
              <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col leading-none gap-[3px]">
            <span className="text-[17px] font-bold text-r-1 tracking-tight leading-none">Raqib</span>
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase leading-none" style={{ color: 'var(--accent)', opacity: 0.7 }}>Freelancer CRM</span>
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-r-1 mb-1">Create account</h1>
        <p className="text-[13px] text-r-3 mb-8">Start managing your freelance business</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field label="Full Name" error={errors.name} touched={!!touched.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              onBlur={() => touch('name')}
              placeholder="Your name"
              className={inputClass('name')}
            />
          </Field>

          <Field label="Email" error={errors.email} touched={!!touched.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              onBlur={() => touch('email')}
              placeholder="you@example.com"
              className={inputClass('email')}
            />
          </Field>

          <Field label="Freelance Title" error={errors.freelanceTitle} touched={!!touched.freelanceTitle} hint="Optional — e.g. Full-stack Developer">
            <input
              type="text"
              value={form.freelanceTitle}
              onChange={(e) => set('freelanceTitle', e.target.value)}
              onBlur={() => touch('freelanceTitle')}
              placeholder="e.g. Full-stack Developer"
              className={inputClass('freelanceTitle')}
            />
          </Field>

          <Field label="Password" error={errors.password} touched={!!touched.password} hint="At least 8 characters">
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              onBlur={() => touch('password')}
              placeholder="••••••••"
              className={inputClass('password')}
            />
          </Field>

          {serverError && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-[8px] border"
              style={{ background: 'var(--overdue-bg)', borderColor: 'rgba(248,113,113,0.25)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[1px]">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-[12px] leading-relaxed" style={{ color: 'var(--overdue)' }}>{serverError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-r-accent text-[#0C0E14] font-semibold text-[13px] py-3 rounded-[8px] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-r-border" />
          <span className="text-[11px] text-r-3 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-r-border" />
        </div>

        <OAuthButtons />

        <p className="text-[12px] text-r-3 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-r-accent hover:opacity-80 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
