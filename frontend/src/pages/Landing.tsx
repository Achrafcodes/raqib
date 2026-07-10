import { Link } from 'react-router-dom';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[36px] h-[36px] rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <polyline points="1,13 5,9 8,11 12,5 16,7 21,1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="21" cy="1" r="2" fill="#4ADE80" />
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none gap-[3px]">
        <span className="text-[17px] font-bold text-r-1 tracking-tight leading-none">Raqib</span>
        <span className="text-[9px] font-semibold tracking-[0.14em] uppercase leading-none" style={{ color: 'var(--accent)', opacity: 0.7 }}>
          Freelancer CRM
        </span>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Client Management',
    desc: 'Keep all your clients in one place. Track contact info, project history, and follow-ups effortlessly.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" />
      </svg>
    ),
    title: 'Project Tracking',
    desc: "See every project status at a glance. Never lose track of what's in progress, paused, or overdue.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Invoicing & PDF',
    desc: 'Create professional invoices, download as PDF, and send directly to clients — all in seconds.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Earnings Dashboard',
    desc: 'Visualize your monthly income, pipeline, and active projects — a real-time pulse on your business.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Follow-up Reminders',
    desc: 'Set reminders for follow-ups and get daily email digests so no client ever slips through the cracks.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'Your data is yours. JWT auth with httpOnly cookies, no third-party trackers, no data selling.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text-1)' }}>
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'rgba(12,14,20,0.85)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] font-medium px-4 py-[7px] rounded-[8px] transition-colors"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-[13px] font-semibold px-4 py-[7px] rounded-[8px] transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#0C0E14' }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-[5px] rounded-[999px] text-[11px] font-semibold mb-8 border"
          style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)', color: 'var(--accent)' }}
        >
          <span className="w-[6px] h-[6px] rounded-full bg-r-accent inline-block" />
          Built for solo freelancers
        </div>

        <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-bold tracking-tight leading-[1.1] mb-6 max-w-[780px]">
          Keep an eye on{' '}
          <span style={{ color: 'var(--accent)' }}>your business</span>
        </h1>

        <p className="text-[16px] sm:text-[18px] max-w-[520px] leading-relaxed mb-10" style={{ color: 'var(--text-2)' }}>
          Raqib is the CRM built for freelancers. Track clients, projects, invoices, and follow-ups — all in one dark, distraction-free dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/register"
            className="text-[14px] font-semibold px-6 py-3 rounded-[10px] transition-opacity hover:opacity-90 w-full sm:w-auto text-center"
            style={{ background: 'var(--accent)', color: '#0C0E14' }}
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="text-[14px] font-medium px-6 py-3 rounded-[10px] border transition-colors w-full sm:w-auto text-center"
            style={{ borderColor: 'var(--border-2)', color: 'var(--text-2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Sign in
          </Link>
        </div>

        {/* MOCK DASHBOARD PREVIEW */}
        <div
          className="mt-16 sm:mt-20 w-full max-w-[860px] rounded-[16px] border overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        >
          {/* Fake toolbar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#F87171' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#FBBF24' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#4ADE80' }} />
            <div className="flex-1 mx-4 h-6 rounded-[6px] flex items-center justify-center text-[11px]" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>
              raqib-one.vercel.app
            </div>
          </div>
          {/* Fake stats */}
          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[18px] sm:text-[22px] font-bold text-r-1">Dashboard</p>
                <p className="text-[12px] text-r-3 mt-[2px]">July 2026</p>
              </div>
              <div
                className="px-3 py-[6px] rounded-[8px] text-[12px] font-semibold"
                style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--accent)' }}
              >
                + New Invoice
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Earned', value: '$12,450', delta: '+18%' },
                { label: 'Active Projects', value: '7', delta: '' },
                { label: 'Unpaid Invoices', value: '3', delta: '' },
                { label: 'Follow-ups Today', value: '2', delta: '' },
              ].map((s) => (
                <div key={s.label} className="rounded-[10px] p-4 border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-3)' }}>{s.label}</p>
                  <p className="text-[20px] font-bold text-r-1">{s.value}</p>
                  {s.delta && <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--accent)' }}>{s.delta}</p>}
                </div>
              ))}
            </div>
            {/* Fake chart bars */}
            <div className="rounded-[10px] border p-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-3)' }}>Earnings — Last 6 Months</p>
              <div className="flex items-end gap-2 h-[80px]">
                {[40, 65, 45, 80, 55, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-[4px] transition-all" style={{ height: `${h}%`, background: i === 5 ? 'var(--accent)' : 'var(--border-2)', opacity: i === 5 ? 1 : 0.6 }} />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                  <div key={m} className="flex-1 text-center text-[10px]" style={{ color: 'var(--text-3)' }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 sm:px-8 py-20 sm:py-28" style={{ background: 'var(--surface)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--accent)' }}>Everything you need</p>
            <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight">Built for the solo freelancer</h2>
            <p className="text-[15px] mt-3 max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--text-2)' }}>
              No team features. No bloat. Just the tools you need to run your freelance business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-[12px] p-6 border transition-colors"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              >
                <div className="w-10 h-10 rounded-[8px] flex items-center justify-center mb-4" style={{ background: 'rgba(74,222,128,0.1)' }}>
                  {f.icon}
                </div>
                <p className="text-[14px] font-semibold text-r-1 mb-2">{f.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-20 sm:py-28 text-center">
        <div className="max-w-[520px] mx-auto">
          <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight mb-4">
            Ready to take control?
          </h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text-2)' }}>
            Join freelancers who use Raqib to stay organized and get paid faster.
          </p>
          <Link
            to="/register"
            className="inline-block text-[14px] font-semibold px-8 py-3 rounded-[10px] transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#0C0E14' }}
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-5 sm:px-8 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} Raqib. Built for freelancers.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-[12px] transition-colors" style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >Sign in</Link>
            <Link to="/register" className="text-[12px] transition-colors" style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
