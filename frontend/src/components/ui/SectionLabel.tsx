import type { ReactNode } from 'react';

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]">{children}</span>
  );
}
