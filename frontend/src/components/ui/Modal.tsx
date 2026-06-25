import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-[480px] rounded-t-[16px] sm:rounded-[12px] border border-r-border flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        style={{ background: 'var(--surface)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 border-b border-r-border shrink-0">
          <span className="text-[15px] font-semibold text-r-1">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer text-[18px] leading-none"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
