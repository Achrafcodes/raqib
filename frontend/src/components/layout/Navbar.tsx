import { useState } from 'react';

const TABS = ['Dashboard', 'Clients', 'Projects', 'Invoices', 'Reports'];

export default function Navbar() {
  const [active, setActive] = useState('Dashboard');

  return (
    <nav className="h-12 bg-r-bg border-b border-r-border px-6 sticky top-0 z-50 flex items-center justify-between">
      {/* LEFT — Logo + Wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-r-accent rounded-[6px] flex items-center justify-center text-[13px] font-bold text-[#0C0E14]">
          R
        </div>
        <span className="text-[15px] font-semibold text-r-1">Raqib</span>
      </div>

      {/* CENTER — Nav tabs */}
      <div className="flex items-center bg-r-surface border border-r-border rounded-[999px] p-[3px] gap-[2px]">
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <span
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-[12px] font-medium px-4 py-[5px] rounded-[999px] cursor-pointer transition-colors duration-100 ${
                isActive
                  ? 'bg-r-accent text-[#0C0E14]'
                  : 'text-r-3 hover:text-r-2'
              }`}
            >
              {tab}
            </span>
          );
        })}
      </div>

      {/* RIGHT — Icons */}
      <div className="flex items-center gap-3">
        <span className="text-[15px] text-r-3 cursor-pointer">⚙</span>
        <span className="text-[16px] text-r-3 cursor-pointer">🔔</span>
        <div className="w-8 h-8 rounded-full bg-r-accent text-[11px] font-semibold text-[#0C0E14] flex items-center justify-center">
          YO
        </div>
      </div>
    </nav>
  );
}
