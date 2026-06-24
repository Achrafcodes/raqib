import { useState, FormEvent, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'MAD', 'CAD', 'AUD'];

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', freelanceTitle: '', currency: 'USD' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(!document.documentElement.classList.contains('light'));

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, freelanceTitle: user.freelanceTitle, currency: user.currency });
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/auth/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silently fail for now
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const light = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    setIsDark(!light);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-raqib-text">Settings</h1>
        <p className="text-[12px] text-raqib-muted mt-0.5">Manage your profile and preferences</p>
      </div>

      <div className="max-w-lg flex flex-col gap-6">
        {/* Profile */}
        <div className="bg-raqib-surface border border-raqib-border rounded-[6px] p-6">
          <p className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest mb-4">Profile</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" value={form.name} onChange={set('name')} />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} />
            <Input label="Freelance Title" placeholder="Full-stack Developer" value={form.freelanceTitle} onChange={set('freelanceTitle')} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">Currency</label>
              <select value={form.currency} onChange={set('currency')} className="w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text focus:outline-none focus:border-raqib-accent">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</Button>
              {saved && <p className="text-[12px] text-raqib-accent">Saved!</p>}
            </div>
          </form>
        </div>

        {/* Appearance */}
        <div className="bg-raqib-surface border border-raqib-border rounded-[6px] p-6">
          <p className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest mb-4">Appearance</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-raqib-text">Theme</p>
              <p className="text-[12px] text-raqib-muted mt-0.5">{isDark ? 'Dark mode' : 'Light mode'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-10 h-5 rounded-full transition-colors relative ${isDark ? 'bg-raqib-accent' : 'bg-raqib-border'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
