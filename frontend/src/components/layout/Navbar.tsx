import { useState } from 'react';
import { BellIcon, SettingsIcon } from '../ui/Icons';

const TABS = ['Dashboard', 'Clients', 'Projects', 'Invoices', 'Reports'];

function RaqibLogo() {
  return (
    <div className="flex items-center gap-[10px]">
      {/* Eye mark — "Keep an eye on your business" */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        {/* outer eye shape */}
        <path
          d="M4 16C4 16 9 7 16 7C23 7 28 16 28 16C28 16 23 25 16 25C9 25 4 16 4 16Z"
          fill="#0C0E14"
          stroke="#4ADE80"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* iris ring */}
        <circle cx="16" cy="16" r="5" fill="#0C0E14" stroke="#4ADE80" strokeWidth="1.6" />
        {/* pupil */}
        <circle cx="16" cy="16" r="2.2" fill="#4ADE80" />
        {/* glint */}
        <circle cx="18" cy="14" r="0.9" fill="#0C0E14" opacity="0.7" />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-[17px] font-bold text-r-1 tracking-tight">Raqib</span>
        <span className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--accent)' }}>
          Freelancer CRM
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [active, setActive] = useState('Dashboard');

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
          const isActive = tab === active;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-[13px] font-medium px-5 py-[6px] rounded-[999px] cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-r-accent text-[#0C0E14] font-semibold'
                  : 'text-r-3 hover:text-r-2 hover:bg-r-s2'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* RIGHT — Icon buttons + Avatar */}
      <div className="flex items-center gap-2">
        {/* Settings */}
        <button
          className="w-9 h-9 rounded-[8px] flex items-center justify-center text-r-2 hover:text-r-1 hover:bg-r-surface border border-transparent hover:border-r-border transition-all duration-150 cursor-pointer"
          aria-label="Settings"
        >
          <SettingsIcon size={17} />
        </button>

        {/* Bell with notification dot */}
        <button
          className="relative w-9 h-9 rounded-[8px] flex items-center justify-center text-r-2 hover:text-r-1 hover:bg-r-surface border border-transparent hover:border-r-border transition-all duration-150 cursor-pointer"
          aria-label="Notifications"
        >
          <BellIcon size={17} />
          {/* notification dot */}
          <span
            className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full border-[1.5px] border-r-bg"
            style={{ background: 'var(--overdue)' }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-r-border mx-1" />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-r-accent text-[12px] font-bold text-[#0C0E14] flex items-center justify-center cursor-pointer select-none">
          YO
        </div>
      </div>
    </nav>
  );
}
