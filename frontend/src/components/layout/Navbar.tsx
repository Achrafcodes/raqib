import { useState } from 'react';
import { BellIcon, SettingsIcon } from '../ui/Icons';

const TABS = ['Dashboard', 'Clients', 'Projects', 'Invoices', 'Reports'];

function RaqibLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Chart spark mark */}
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          {/* rising spark line — mirrors the earnings chart */}
          <polyline
            points="1,13 5,9 8,11 12,5 16,7 21,1"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* peak dot */}
          <circle cx="21" cy="1" r="2" fill="#4ADE80" />
          {/* subtle baseline */}
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Wordmark */}
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
