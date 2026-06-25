import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }

    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message ?? 'Verification failed. The link may have expired.');
      });
  }, [searchParams]);

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
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 rounded-full border-2 border-r-border border-t-r-accent animate-spin mx-auto mb-4" />
              <p className="text-[14px] text-r-2">Verifying your email…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(74,222,128,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="text-[18px] font-bold text-r-1 mb-2">Email verified!</h1>
              <p className="text-[13px] text-r-2 mb-6">Your account is now fully verified. You can continue using Raqib.</p>
              <Link
                to="/"
                className="block w-full py-[10px] rounded-[8px] text-[13px] font-semibold text-center transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)', color: '#0C0E14' }}
              >
                Go to Dashboard
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(248,113,113,0.1)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h1 className="text-[18px] font-bold text-r-1 mb-2">Verification failed</h1>
              <p className="text-[13px] text-r-2 mb-6">{message}</p>
              <Link
                to="/"
                className="block w-full py-[10px] rounded-[8px] text-[13px] font-semibold text-center border border-r-border text-r-2 hover:text-r-1 transition-colors"
              >
                Back to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
