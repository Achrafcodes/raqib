import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', freelanceTitle: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch {
      setError('Could not create account. Email may already be in use.');
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
          <p className="text-[11px] font-medium text-raqib-muted uppercase tracking-[0.14em] mb-4">Free forever for solo freelancers</p>
          <h2 className="text-[32px] font-bold text-raqib-text leading-[1.15] tracking-tight mb-6">
            Your whole<br />freelance business<br />in one place.
          </h2>
          <div className="flex flex-col gap-3">
            {['Clients, projects & invoices', 'Earnings overview & charts', 'Follow-up reminders'].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-raqib-accent flex-shrink-0" />
                <span className="text-[13px] text-raqib-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-raqib-muted">No credit card required.</p>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-[340px]">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-6 h-6 rounded-[3px] bg-raqib-accent flex items-center justify-center">
              <span className="text-[11px] font-bold text-[#0B0F1A]">R</span>
            </div>
            <span className="text-[14px] font-semibold text-raqib-text">Raqib</span>
          </div>

          <h1 className="text-[20px] font-semibold text-raqib-text mb-1">Create account</h1>
          <p className="text-[13px] text-raqib-muted mb-7">Set up your workspace in 30 seconds</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="Achraf El Soussi" value={form.name} onChange={set('name')} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            <Input label="Freelance Title (optional)" placeholder="Full-stack Developer" value={form.freelanceTitle} onChange={set('freelanceTitle')} />
            {error && <p className="text-[12px] text-status-overdue">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? 'Creating account…' : 'Get started'}
            </Button>
          </form>

          <p className="text-[13px] text-raqib-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-raqib-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
