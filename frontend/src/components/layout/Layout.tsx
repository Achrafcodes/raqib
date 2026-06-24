import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-r-bg overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
        <Sidebar />
      </div>
    </div>
  );
}
