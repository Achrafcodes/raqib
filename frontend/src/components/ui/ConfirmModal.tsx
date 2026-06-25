import { useEffect } from 'react';

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onCancel} />

      {/* Card */}
      <div
        className="relative w-full max-w-[360px] rounded-[14px] border border-r-border p-6 flex flex-col gap-4"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center"
          style={{ background: 'var(--overdue-bg)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-[15px] font-semibold text-r-1">{title}</h2>
          <p className="text-[13px] text-r-3 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={onCancel}
            className="px-4 py-[8px] rounded-[8px] text-[13px] font-medium text-r-3 hover:text-r-1 hover:bg-r-s2 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-[8px] rounded-[8px] text-[13px] font-semibold text-white disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'var(--overdue)' }}
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
