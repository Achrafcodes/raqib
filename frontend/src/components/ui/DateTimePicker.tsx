import { useState, useRef, useEffect } from 'react';

interface Props {
  value: string; // ISO datetime string "YYYY-MM-DDTHH:mm"
  onChange: (v: string) => void;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function fmt2(n: number) { return String(n).padStart(2, '0'); }

function toISO(y: number, mo: number, d: number, h: number, mi: number) {
  return `${y}-${fmt2(mo)}-${fmt2(d)}T${fmt2(h)}:${fmt2(mi)}`;
}

function parseVal(value: string) {
  const d = value ? new Date(value) : new Date();
  return {
    year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
    hour: d.getHours(), minute: d.getMinutes(),
  };
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { year, month, day, hour, minute } = parseVal(value);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (d: number) => {
    onChange(toISO(viewYear, viewMonth, d, hour, minute));
  };

  const setTime = (h: number, mi: number) => {
    onChange(toISO(year, month, day, h, mi));
  };

  const isToday = (d: number) => {
    const now = new Date();
    return d === now.getDate() && viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();
  };

  const isSelected = (d: number) =>
    d === day && viewMonth === month && viewYear === year;

  // display label
  const label = value
    ? `${fmt2(day)} ${MONTHS[month - 1].slice(0, 3)} ${year}  ${fmt2(hour)}:${fmt2(minute)}`
    : 'Select date & time';

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-r-bg border border-r-border rounded-[8px] px-3 py-[9px] text-[13px] text-r-1 outline-none focus:border-r-accent transition-colors cursor-pointer hover:border-r-b2"
      >
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-r-3 shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute z-[200] mt-2 rounded-[12px] border border-r-border shadow-2xl"
          style={{ background: 'var(--surface)', width: 296 }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-[6px] text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <span className="text-[13px] font-semibold text-r-1">{MONTHS[viewMonth - 1]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-[6px] text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 mb-1">
            {DAYS.map((d) => (
              <span key={d} className="text-[10px] font-semibold text-r-3 text-center py-1">{d}</span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-[2px]">
            {Array.from({ length: firstDow }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => selectDay(d)}
                className={`
                  h-8 w-full flex items-center justify-center text-[12px] font-medium rounded-[6px] cursor-pointer transition-all
                  ${isSelected(d)
                    ? 'text-[#0C0E14] font-bold'
                    : isToday(d)
                    ? 'text-r-accent border border-r-accent'
                    : 'text-r-2 hover:bg-r-s2 hover:text-r-1'
                  }
                `}
                style={isSelected(d) ? { background: 'var(--accent)' } : {}}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Time picker */}
          <div className="border-t border-r-border px-4 py-3 flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-r-3 shrink-0">
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            <div className="flex items-center gap-2 flex-1">
              {/* Hour */}
              <input
                type="number" min="0" max="23"
                value={fmt2(hour)}
                onChange={(e) => {
                  const h = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
                  setTime(h, minute);
                }}
                className="w-[52px] bg-r-bg border border-r-border rounded-[6px] px-2 py-[6px] text-[13px] text-r-1 text-center outline-none focus:border-r-accent transition-colors"
              />
              <span className="text-r-3 font-bold text-[15px]">:</span>
              {/* Minute */}
              <input
                type="number" min="0" max="59"
                value={fmt2(minute)}
                onChange={(e) => {
                  const mi = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setTime(hour, mi);
                }}
                className="w-[52px] bg-r-bg border border-r-border rounded-[6px] px-2 py-[6px] text-[13px] text-r-1 text-center outline-none focus:border-r-accent transition-colors"
              />
              {/* Quick time pills */}
              <div className="flex gap-[4px] ml-2">
                {[9, 12, 18].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTime(h, 0)}
                    className={`px-2 py-[4px] rounded-[4px] text-[10px] font-semibold cursor-pointer transition-all ${
                      hour === h && minute === 0 ? 'text-[#0C0E14]' : 'text-r-3 hover:text-r-1 bg-r-s2 hover:bg-r-border'
                    }`}
                    style={hour === h && minute === 0 ? { background: 'var(--accent)' } : {}}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Done button */}
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-[8px] rounded-[8px] text-[13px] font-semibold text-[#0C0E14] cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'var(--accent)' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
