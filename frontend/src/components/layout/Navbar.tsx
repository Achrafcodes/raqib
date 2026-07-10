import { useLocation, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BellIcon, SettingsIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRefresh } from '../../context/RefreshContext';

const TABS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clients',   path: '/clients' },
  { label: 'Projects',  path: '/projects' },
  { label: 'Invoices',  path: '/invoices' },
  { label: 'Reminders', path: '/reminders' },
];

interface Notif {
  id: string;
  type: 'reminder' | 'project' | 'invoice';
  title: string;
  dueDate: string;
  path: string;
}

function notifColor(n: Notif): string {
  const diff = new Date(n.dueDate).getTime() - Date.now();
  if (diff < 0) return 'var(--overdue)';
  if (diff < 86400000) return 'var(--overdue)';
  if (diff < 86400000 * 2) return 'var(--pending)';
  return 'var(--paid)';
}

function notifBg(n: Notif): string {
  const diff = new Date(n.dueDate).getTime() - Date.now();
  if (diff < 0) return 'var(--overdue-bg)';
  if (diff < 86400000) return 'var(--overdue-bg)';
  if (diff < 86400000 * 2) return 'var(--pending-bg)';
  return 'var(--paid-bg)';
}

function notifLabel(n: Notif): string {
  const diff = new Date(n.dueDate).getTime() - Date.now();
  const typeLabel = n.type === 'reminder' ? 'Reminder' : n.type === 'project' ? 'Project deadline' : 'Invoice due';
  if (diff < 0) return `${typeLabel} · Overdue`;
  if (diff < 86400000) return `${typeLabel} · Due today`;
  if (diff < 86400000 * 2) return `${typeLabel} · Due tomorrow`;
  const days = Math.ceil(diff / 86400000);
  return `${typeLabel} · In ${days} days`;
}

function NotifIcon({ type }: { type: Notif['type'] }) {
  if (type === 'reminder') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-r-1">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
  if (type === 'project') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-r-1">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-r-1">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function RaqibLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <polyline points="1,13 5,9 8,11 12,5 16,7 21,1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="21" cy="1" r="2" fill="#4ADE80" />
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none gap-[3px]">
        <span className="text-[17px] font-bold text-r-1 tracking-tight leading-none">Raqib</span>
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase leading-none hidden sm:block" style={{ color: 'var(--accent)', opacity: 0.7 }}>
          Freelancer CRM
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const avatarText = user?.name
    ? user.name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
    : 'YO';

  const activeTab = TABS.slice().reverse().find((t) => location.pathname.startsWith(t.path))?.path ?? '/';
  const { tick } = useRefresh();

  // Avatar menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Notification bell
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
      if (!bellRef.current?.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 86400000);

    Promise.all([
      api.get('/api/reminders'),
      api.get('/api/projects'),
      api.get('/api/invoices'),
    ]).then(([rRes, pRes, iRes]) => {
      const items: Notif[] = [];

      for (const r of rRes.data.data) {
        if (r.isDone) continue;
        const due = new Date(r.dueDate);
        if (due <= in3Days) {
          items.push({ id: r._id, type: 'reminder', title: r.title, dueDate: r.dueDate, path: '/reminders' });
        }
      }

      for (const p of pRes.data.data) {
        if (!p.deadline || p.status === 'done' || p.status === 'cancelled') continue;
        const due = new Date(p.deadline);
        if (due <= in3Days) {
          items.push({ id: p._id, type: 'project', title: p.title, dueDate: p.deadline, path: '/projects' });
        }
      }

      for (const inv of iRes.data.data) {
        if (inv.status === 'paid') continue;
        if (!inv.dueDate) continue;
        const due = new Date(inv.dueDate);
        if (due <= in3Days) {
          items.push({ id: inv._id, type: 'invoice', title: inv.invoiceNumber, dueDate: inv.dueDate, path: '/invoices' });
        }
      }

      items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setNotifs(items);
    }).catch(() => {});
  }, [tick]);

  return (
    <>
      <nav
        className="h-[60px] bg-r-bg border-b border-r-border px-4 sm:px-6 sticky top-0 z-50 flex items-center justify-between"
        style={{ borderBottomColor: 'var(--border)' }}
      >
        {/* LEFT — Logo */}
        <Link to="/" className="focus:outline-none">
          <RaqibLogo />
        </Link>

        {/* CENTER — Nav tabs (desktop only) */}
        <div className="hidden md:flex items-center bg-r-surface border border-r-border rounded-[999px] p-1 gap-[2px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`text-[13px] font-medium px-4 py-[6px] rounded-[999px] cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-r-accent text-[#0C0E14] font-semibold'
                    : 'text-r-3 hover:text-r-2 hover:bg-r-s2'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* Bell dropdown */}
          <div ref={bellRef} className="relative hidden sm:block">
            <button
              onClick={() => setBellOpen((p) => !p)}
              className={`relative w-9 h-9 rounded-[8px] flex items-center justify-center border transition-all duration-150 cursor-pointer ${bellOpen ? 'text-r-1 bg-r-surface border-r-border' : 'text-r-2 hover:text-r-1 hover:bg-r-surface border-transparent hover:border-r-border'}`}
              aria-label="Notifications"
            >
              <BellIcon size={17} />
              {notifs.length > 0 && (
                <span
                  className="absolute top-[6px] right-[6px] min-w-[8px] h-[8px] rounded-full border-[1.5px] border-r-bg flex items-center justify-center"
                  style={{ background: 'var(--overdue)' }}
                />
              )}
            </button>

            {bellOpen && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] w-[300px] rounded-[10px] border border-r-border z-50 overflow-hidden"
                style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-r-border">
                  <span className="text-[13px] font-semibold text-r-1">Notifications</span>
                  {notifs.length > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-[2px] rounded-full" style={{ background: 'var(--overdue-bg)', color: 'var(--overdue)' }}>
                      {notifs.length}
                    </span>
                  )}
                </div>

                {notifs.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--surface-2)' }}>
                      <BellIcon size={18} />
                    </div>
                    <p className="text-[13px] font-medium text-r-2">All clear!</p>
                    <p className="text-[11px] text-r-3 mt-1">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifs.map((n) => (
                      <Link
                        key={n.id}
                        to={n.path}
                        onClick={() => setBellOpen(false)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-r-s2 transition-colors cursor-pointer border-b border-r-border last:border-0 text-left"
                      >
                        <div className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 mt-[1px]" style={{ background: notifBg(n) }}>
                          <NotifIcon type={n.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-r-1 truncate">{n.title}</p>
                          <p className="text-[11px] mt-[2px]" style={{ color: notifColor(n) }}>
                            {notifLabel(n)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-r-border mx-1 hidden sm:block" />

          {/* Avatar dropdown */}
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
                <div className="px-4 py-3 border-b border-r-border">
                  <p className="text-[13px] font-semibold text-r-1 truncate">{user?.name}</p>
                  <p className="text-[11px] text-r-3 truncate mt-[1px]">{user?.email}</p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-[9px] text-[13px] text-r-2 hover:text-r-1 hover:bg-r-s2 transition-colors cursor-pointer"
                >
                  <SettingsIcon size={15} />
                  Settings
                </Link>

                <div className="h-px bg-r-border mx-2 my-1" />

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

      {/* BOTTOM NAV — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-r-border flex items-center" style={{ background: 'var(--bg)' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-[3px] transition-colors cursor-pointer ${
                isActive ? 'text-r-accent' : 'text-r-3'
              }`}
            >
              <TabIcon path={tab.path} />
              <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function TabIcon({ path }: { path: string }) {
  const cls = "w-[18px] h-[18px]";
  if (path === '/') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
  if (path === '/clients') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  if (path === '/projects') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
  if (path === '/invoices') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
