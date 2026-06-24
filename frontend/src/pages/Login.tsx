import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-r-bg px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-r-surface border border-r-border rounded-[8px] px-4 py-3 text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-semibold text-r-3 uppercase tracking-[0.08em]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-r-surface border border-r-border rounded-[8px] px-4 py-3 text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors"
            />
          </div>

          {error && <p className="text-[12px] text-[var(--overdue)]">{error}</p>}

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
