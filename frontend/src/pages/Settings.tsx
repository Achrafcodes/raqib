import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Select from '../components/ui/Select';

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'MAD', label: 'MAD — Moroccan Dirham' },
  { value: 'TND', label: 'TND — Tunisian Dinar' },
  { value: 'DZD', label: 'DZD — Algerian Dinar' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
];

const NAME_RE = /^.{2,}$/;
const PASSWORD_RE = /^.{8,}$/;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <span className="flex items-center gap-1 text-[11px] mt-1" style={{ color: 'var(--overdue)' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {msg}
    </span>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-r-border p-6" style={{ background: 'var(--surface)' }}>
      <div className="mb-5">
        <h2 className="text-[15px] font-semibold text-r-1">{title}</h2>
        <p className="text-[12px] text-r-3 mt-[2px]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { user, updateUser } = useAuth();

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    freelanceTitle: user?.freelanceTitle ?? '',
    currency: user?.currency ?? 'USD',
  });
  const [profileTouched, setProfileTouched] = useState<Record<string, boolean>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password form
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdTouched, setPwdTouched] = useState<Record<string, boolean>>({});
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Profile validation
  function validateProfile(f: typeof profile) {
    const e: Record<string, string> = {};
    if (!NAME_RE.test(f.name.trim())) e.name = 'Name must be at least 2 characters';
    return e;
  }

  // Password validation
  function validatePwd(f: typeof pwd) {
    const e: Record<string, string> = {};
    if (!f.currentPassword) e.currentPassword = 'Current password is required';
    if (!PASSWORD_RE.test(f.newPassword)) e.newPassword = 'New password must be at least 8 characters';
    if (f.confirmPassword !== f.newPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  const profileErrs = validateProfile(profile);
  const pwdErrs = validatePwd(pwd);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileTouched({ name: true, freelanceTitle: true, currency: true });
    if (Object.keys(validateProfile(profile)).length > 0) return;
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      const res = await api.put('/api/user/profile', profile);
      const updated = res.data.data;
      updateUser({
        id: updated._id ?? updated.id,
        name: updated.name,
        email: updated.email,
        freelanceTitle: updated.freelanceTitle,
        currency: updated.currency,
        isEmailVerified: updated.isEmailVerified,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setProfileError(msg ?? 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePwdSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
    if (Object.keys(validatePwd(pwd)).length > 0) return;
    setPwdSaving(true);
    setPwdError('');
    setPwdSuccess(false);
    try {
      await api.put('/api/user/password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwdTouched({});
      setPwdSuccess(true);
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPwdError(msg ?? 'Failed to update password');
    } finally {
      setPwdSaving(false);
    }
  };

  const inputClass = (hasErr: boolean) =>
    `w-full bg-r-bg border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 placeholder:text-r-3 outline-none focus:border-r-accent transition-colors ${
      hasErr ? 'border-[var(--overdue)]' : 'border-r-border'
    }`;

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-r-1 leading-tight">Settings</h1>
        <p className="text-[13px] text-r-3 mt-[2px]">Manage your profile and account preferences</p>
      </div>

      {/* Profile */}
      <SectionCard title="Profile" subtitle="Your public info shown across the app">
        <form onSubmit={handleProfileSave} noValidate className="flex flex-col gap-4">
          {profileError && (
            <div className="rounded-[8px] px-3 py-2 text-[12px] font-medium" style={{ background: 'rgba(248,113,113,0.10)', color: 'var(--overdue)', border: '1px solid rgba(248,113,113,0.2)' }}>
              {profileError}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Full Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              onBlur={() => setProfileTouched((t) => ({ ...t, name: true }))}
              placeholder="Your name"
              className={inputClass(!!profileTouched.name && !!profileErrs.name)}
            />
            {profileTouched.name && <FieldError msg={profileErrs.name} />}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Freelance Title</label>
            <input
              value={profile.freelanceTitle}
              onChange={(e) => setProfile((p) => ({ ...p, freelanceTitle: e.target.value }))}
              placeholder="e.g. Full-stack Developer, UI Designer"
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Default Currency</label>
            <Select
              value={profile.currency}
              onChange={(v) => setProfile((p) => ({ ...p, currency: v }))}
              options={CURRENCIES}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {profileSaving ? 'Saving…' : 'Save Profile'}
            </button>
            {profileSuccess && (
              <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'var(--paid)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* Account info (read-only) */}
      <SectionCard title="Account" subtitle="Your login credentials">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Email</label>
            <div className="w-full bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-3 select-all">
              {user?.email}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" subtitle="Choose a strong password of at least 8 characters">
        <form onSubmit={handlePwdSave} noValidate className="flex flex-col gap-4">
          {pwdError && (
            <div className="rounded-[8px] px-3 py-2 text-[12px] font-medium" style={{ background: 'rgba(248,113,113,0.10)', color: 'var(--overdue)', border: '1px solid rgba(248,113,113,0.2)' }}>
              {pwdError}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Current Password</label>
            <input
              type="password"
              value={pwd.currentPassword}
              onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
              onBlur={() => setPwdTouched((t) => ({ ...t, currentPassword: true }))}
              placeholder="Enter current password"
              className={inputClass(!!pwdTouched.currentPassword && !!pwdErrs.currentPassword)}
            />
            {pwdTouched.currentPassword && <FieldError msg={pwdErrs.currentPassword} />}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">New Password</label>
            <input
              type="password"
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
              onBlur={() => setPwdTouched((t) => ({ ...t, newPassword: true }))}
              placeholder="At least 8 characters"
              className={inputClass(!!pwdTouched.newPassword && !!pwdErrs.newPassword)}
            />
            {pwdTouched.newPassword && <FieldError msg={pwdErrs.newPassword} />}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-r-3 uppercase tracking-[0.07em] mb-[6px]">Confirm New Password</label>
            <input
              type="password"
              value={pwd.confirmPassword}
              onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
              onBlur={() => setPwdTouched((t) => ({ ...t, confirmPassword: true }))}
              placeholder="Repeat new password"
              className={inputClass(!!pwdTouched.confirmPassword && !!pwdErrs.confirmPassword)}
            />
            {pwdTouched.confirmPassword && <FieldError msg={pwdErrs.confirmPassword} />}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={pwdSaving}
              className="px-5 py-[9px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {pwdSaving ? 'Updating…' : 'Update Password'}
            </button>
            {pwdSuccess && (
              <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'var(--paid)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Password updated
              </span>
            )}
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
