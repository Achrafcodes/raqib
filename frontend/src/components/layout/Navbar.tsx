import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BellIcon, SettingsIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Clients',   path: '/clients' },
  { label: 'Projects',  path: '/projects' },
  { label: 'Invoices',  path: '/invoices' },
  { label: 'Reminders', path: '/reminders' },
];

function RaqibLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <polyline
            points="1,13 5,9 8,11 12,5 16,7 21,1"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="1" r="2" fill="#4ADE80" />
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none gap-[3px]">
        <span className="text-[17px] font-bold text-r-1 tracking-tight leading-none">Raqib</span>
        <span
          className="text-[9px] font-semibold tracking-[0.14em] uppercase leading-none"
          style={{ color: 'var(--accent)', opacity: 0.7 }}
        >
          Freelancer CRM
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatarText = user?.name
    ? user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : 'YO';

  const activeTab = TABS.slice().reverse().find((t) => location.pathname.startsWith(t.path))?.path ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav
      className="h-[60px] bg-r-bg border-b border-r-border px-6 sticky top-0 z-50 flex items-center justify-between"
      style={{ borderBottomColor: 'var(--border)' }}
    >
      {/* LEFT — Logo */}
      <RaqibLogo />

      {/* CENTER — Nav tabs */}
      <div className="flex items-center bg-r-surface border border-r-border rounded-[999px] p-1 gap-[2px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`text-[13px] font-medium px-5 py-[6px] rounded-[999px] cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-r-accent text-[#0C0E14] font-semibold'
                  : 'text-r-3 hover:text-r-2 hover:bg-r-s2'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* RIGHT — Bell + Avatar dropdown */}
      <div className="flex items-center gap-2">
        <button
          className="relative w-9 h-9 rounded-[8px] flex items-center justify-center text-r-2 hover:text-r-1 hover:bg-r-surface border border-transparent hover:border-r-border transition-all duration-150 cursor-pointer"
          aria-label="Notifications"
        >
          <BellIcon size={17} />
          <span
            className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full border-[1.5px] border-r-bg"
            style={{ background: 'var(--overdue)' }}
          />
        </button>

        <div className="w-px h-5 bg-r-border mx-1" />

        {/* Avatar + dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-9 h-9 rounded-full bg-r-accent text-[12px] font-bold text-[#0C0E14] flex items-center justify-center cursor-pointer select-none hover:opacity-80 transition-opacity"
          >
            {avatarText}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-[200px] rounded-[10px] border border-r-border py-1 z-50"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-r-border">
                <p className="text-[13px] font-semibold text-r-1 truncate">{user?.name}</p>
                <p className="text-[11px] text-r-3 truncate mt-[1px]">{user?.email}</p>
              </div>

              {/* Settings */}
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-[9px] text-[13px] text-r-2 hover:text-r-1 hover:bg-r-s2 transition-colors cursor-pointer"
              >
                <SettingsIcon size={15} />
                Settings
              </button>

              {/* Divider */}
              <div className="h-px bg-r-border mx-2 my-1" />

              {/* Logout */}
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-[9px] text-[13px] transition-colors cursor-pointer"
                style={{ color: 'var(--overdue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
