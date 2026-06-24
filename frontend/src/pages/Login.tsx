import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
      setError('Wrong email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-raqib-bg flex">
      {/* Brand side */}
      <div className="hidden md:flex w-[420px] flex-shrink-0 bg-raqib-surface border-r border-raqib-border flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[3px] bg-raqib-accent flex items-center justify-center">
            <span className="text-[11px] font-bold text-[#0B0F1A]">R</span>
          </div>
          <span className="text-[14px] font-semibold text-raqib-text">Raqib</span>
        </div>

        <div>
          <p className="text-[11px] font-medium text-raqib-muted uppercase tracking-[0.14em] mb-4">Freelancer CRM</p>
          <h2 className="text-[32px] font-bold text-raqib-text leading-[1.15] tracking-tight mb-6">
            Keep an eye<br />on your<br />business.
          </h2>
          <div className="flex flex-col gap-3">
            {['Track every client and project', 'Send invoices, get paid faster', 'Never miss a follow-up'].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-raqib-accent flex-shrink-0" />
                <span className="text-[13px] text-raqib-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-raqib-muted">Built for solo freelancers.</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-[340px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-6 h-6 rounded-[3px] bg-raqib-accent flex items-center justify-center">
              <span className="text-[11px] font-bold text-[#0B0F1A]">R</span>
            </div>
            <span className="text-[14px] font-semibold text-raqib-text">Raqib</span>
          </div>

          <h1 className="text-[20px] font-semibold text-raqib-text mb-1">Sign in</h1>
          <p className="text-[13px] text-raqib-muted mb-7">Welcome back to your workspace</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-[12px] text-status-overdue">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-[13px] text-raqib-muted mt-5">
            No account?{' '}
            <Link to="/register" className="text-raqib-accent hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
