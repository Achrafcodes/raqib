import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function CheckEmail() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await api.post('/auth/resend-verification', { email });
      setResent(true);
    } catch {
      setError('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polyline points="1,12 5,6 8,9 11,4 15,4" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-r-1 tracking-[-0.3px]">Raqib</span>
        </div>

        <div className="rounded-[12px] border border-r-border p-8" style={{ background: 'var(--surface)' }}>
          {/* Icon */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </div>

          <h1 className="text-[20px] font-bold text-r-1 mb-2">Check your inbox</h1>
          <p className="text-[13px] text-r-2 leading-relaxed mb-1">
            We sent a verification link to
          </p>
          {email && (
            <p className="text-[13px] font-semibold mb-5" style={{ color: 'var(--accent)' }}>{email}</p>
          )}
          <p className="text-[12px] text-r-3 mb-6">
            Click the link in the email to activate your account. The link expires in 24 hours.
          </p>

          {error && (
            <p className="text-[12px] mb-4 px-3 py-2 rounded-[6px]" style={{ background: 'rgba(248,113,113,0.08)', color: 'var(--overdue)' }}>{error}</p>
          )}

          {resent ? (
            <p className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>Email sent! Check your inbox again.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[13px] font-medium text-r-3 hover:text-r-2 transition-colors disabled:opacity-50"
            >
              {resending ? 'Sending…' : "Didn't receive it? Resend email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
