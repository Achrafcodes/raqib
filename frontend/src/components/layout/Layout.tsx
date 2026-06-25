import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-r-bg overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
