import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/ui/LoadingScreen';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string) {
  const errs: { email?: string; password?: string } = {};
  if (!email.trim()) errs.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errs.email = 'Enter a valid email address.';
  if (!password) errs.password = 'Password is required.';
  return errs;
}

const BASE = 'bg-r-surface border rounded-[8px] px-4 py-3 text-[13px] text-r-1 placeholder:text-r-3 outline-none transition-colors w-full';

function Field({
  label, children, error, touched,
}: { label: string; children: React.ReactNode; error?: string; touched: boolean }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]">{label}</label>
      {children}
      {touched && error && (
        <div className="flex items-center gap-[6px] mt-[2px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[11px]" style={{ color: 'var(--overdue)' }}>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validate(email, password);
  const touch = (field: keyof typeof touched) => setTouched((t) => ({ ...t, [field]: true }));

  const inputClass = (field: 'email' | 'password') =>
    `${BASE} ${touched[field] && errors[field] ? 'border-[var(--overdue)]' : 'border-r-border focus:border-r-accent'}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length) return;
    setServerError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setServerError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

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

        <h1 className="text-[22px] font-bold text-r-1 mb-1">Welcome back</h1>
        <p className="text-[13px] text-r-3 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field label="Email" error={errors.email} touched={touched.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touch('email')}
              placeholder="you@example.com"
              className={inputClass('email')}
            />
          </Field>

          <Field label="Password" error={errors.password} touched={touched.password}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-[12px] text-r-3 mt-6 text-center">
          No account?{' '}
          <Link to="/register" className="text-r-accent hover:opacity-80 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
