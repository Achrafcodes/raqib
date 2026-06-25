import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
  disabled?: boolean;
}

export default function Select({ value, onChange, options, className = '', disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setOpen((p) => !p);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-[9px] rounded-[8px] text-[13px] text-r-1 border border-r-border outline-none transition-colors cursor-pointer disabled:opacity-50"
        style={{ background: 'var(--bg)', borderColor: open ? 'var(--accent)' : undefined }}
      >
        <span>{selected?.label ?? value}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-r-3 shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && createPortal(
        <ul
          ref={menuRef}
          style={{
            ...menuStyle,
            background: 'var(--surface)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
          className="rounded-[8px] border border-r-border overflow-hidden py-1"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-3 py-[8px] text-[13px] cursor-pointer transition-colors ${
                opt.value === value
                  ? 'text-r-accent font-medium bg-r-s2'
                  : 'text-r-2 hover:text-r-1 hover:bg-r-s2'
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
