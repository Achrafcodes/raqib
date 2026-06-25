import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const showBanner = user && !user.isEmailVerified && !dismissed;

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      setResent(true);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-r-bg overflow-hidden">
      <Navbar />

      {showBanner && (
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 text-[12px]"
          style={{ background: 'rgba(251,191,36,0.08)', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-r-2 truncate">
              Please verify your email address to receive notifications.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {resent ? (
              <span style={{ color: '#4ADE80' }}>Email sent!</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ color: '#FBBF24' }}
              >
                {resending ? 'Sending…' : 'Resend email'}
              </button>
            )}
            <button onClick={() => setDismissed(true)} className="text-r-3 hover:text-r-2 transition-colors">✕</button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
