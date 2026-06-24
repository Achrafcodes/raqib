import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

const tabs = [
  { to: '/',          label: 'Dashboard' },
  { to: '/clients',   label: 'Clients' },
  { to: '/projects',  label: 'Projects' },
  { to: '/invoices',  label: 'Invoices' },
  { to: '/reminders', label: 'Reminders' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="h-11 flex items-stretch justify-between px-6 border-b border-raqib-border bg-raqib-bg flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 pr-8 border-r border-raqib-border">
        <div className="w-5 h-5 rounded-[3px] bg-raqib-accent flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-[#0B0F1A]">R</span>
        </div>
        <span className="text-[13px] font-semibold text-raqib-text tracking-tight">Raqib</span>
      </div>

      {/* Nav tabs */}
      <div className="flex items-stretch gap-0 flex-1 px-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 text-[12px] font-medium transition-colors border-b-2 ${
                isActive
                  ? 'text-raqib-text border-raqib-accent'
                  : 'text-raqib-muted hover:text-raqib-text border-transparent'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 pl-6 border-l border-raqib-border">
        {user && (
          <span className="text-[11px] text-raqib-muted hidden sm:block">
            {user.freelanceTitle || user.name}
          </span>
        )}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="text-[11px] text-raqib-muted hover:text-raqib-text transition-colors"
        >
          Sign out
        </button>
        {user && <Avatar name={user.name} size="md" />}
      </div>
    </nav>
  );
}
