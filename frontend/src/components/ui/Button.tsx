import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'text-[13px] font-medium px-4 py-2 rounded-[6px] transition-colors cursor-pointer disabled:opacity-50';

  const variants = {
    primary: 'bg-raqib-accent hover:bg-raqib-accent-hover text-[#0F1117]',
    ghost:   'border border-raqib-border hover:border-raqib-accent text-raqib-muted hover:text-raqib-text',
    danger:  'border border-status-overdue text-status-overdue hover:bg-status-overdue hover:text-[#0F1117]',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
