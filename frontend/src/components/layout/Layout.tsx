import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-raqib-bg overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-7 py-6">{children}</main>
        <Sidebar />
      </div>
    </div>
  );
}
