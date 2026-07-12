import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background: 'var(--bg)' }}>
      <p className="text-[64px] sm:text-[88px] font-bold leading-none mb-4 tabular-nums" style={{ color: 'var(--accent)', opacity: 0.9 }}>404</p>
      <h1 className="text-[20px] font-bold text-r-1 mb-2">Page not found</h1>
      <p className="text-[13px] text-r-3 mb-8 max-w-[340px] leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-[13px] font-semibold px-6 py-[10px] rounded-[8px] hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)', color: '#0C0E14' }}
        >
          {user ? 'Back to dashboard' : 'Back to home'}
        </Link>
      </div>
    </div>
  );
}
