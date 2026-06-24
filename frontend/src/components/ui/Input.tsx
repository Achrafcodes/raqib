import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest">{label}</label>}
      <input
        className={`w-full bg-raqib-surface border border-raqib-border rounded-[6px] px-3 py-2 text-[13px] text-raqib-text placeholder:text-raqib-muted focus:outline-none focus:border-raqib-accent transition-colors ${error ? 'border-status-overdue' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-status-overdue">{error}</p>}
    </div>
  );
}
