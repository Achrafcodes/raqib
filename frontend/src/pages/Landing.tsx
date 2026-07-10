import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Parallax hook ───────────────────────────────────────── */
function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return offset;
}

/* ── Scroll-reveal hook ──────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Reveal wrapper ──────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  from = 'bottom',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'scale';
}) {
  const { ref, visible } = useReveal();
  const hidden: React.CSSProperties = {
    opacity: 0,
    transform:
      from === 'bottom' ? 'translateY(40px)' :
      from === 'left'   ? 'translateX(-40px)' :
      from === 'right'  ? 'translateX(40px)' :
                          'scale(0.92)',
  };
  const shown: React.CSSProperties = {
    opacity: 1,
    transform: 'none',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  };
  return (
    <div ref={ref} style={visible ? shown : { ...hidden, transition: 'none' }}>
      {children}
    </div>
  );
}

/* ── Logo ────────────────────────────────────────────────── */
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

/* ── Features data ───────────────────────────────────────── */
const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: 'Client Management',
    desc: 'Keep all your clients in one place. Track contact info, project history, and follow-ups effortlessly.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>,
    title: 'Project Tracking',
    desc: "See every project at a glance. Never lose track of what's in progress, paused, or overdue.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    title: 'Invoicing & PDF',
    desc: 'Create professional invoices, download as PDF, and email directly to clients — all in seconds.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: 'Earnings Dashboard',
    desc: 'Visualize your monthly income, pipeline, and active projects — a real-time pulse on your business.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    title: 'Follow-up Reminders',
    desc: 'Set reminders for follow-ups and get daily email digests so no client slips through the cracks.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    title: 'Secure & Private',
    desc: 'Your data is yours. JWT httpOnly cookies, no third-party trackers, no data selling.',
  },
];

/* ── Floating orb (parallax decoration) ─────────────────── */
function Orb({ size, x, y, opacity, speed }: { size: number; x: string; y: string; opacity: number; speed: number }) {
  const offset = useParallax(speed);
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity,
        transform: `translateY(${offset}px)`,
        background: 'radial-gradient(circle, rgba(74,222,128,0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
        transition: 'transform 0.05s linear',
      }}
    />
  );
}

/* ── Animated grid background ────────────────────────────── */
function GridBg() {
  const offset = useParallax(0.15);
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `translateY(${offset}px)`,
        backgroundImage: `
          linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
      }}
    />
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function Landing() {
  const heroOffset = useParallax(0.4);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const heroStyle = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'none' : 'translateY(32px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-1)' }}>

      {/* ── Global styles injected once ── */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes bar-grow { from{height:0} }
        .float { animation: float 6s ease-in-out infinite; }
        .float-slow { animation: float 9s ease-in-out infinite; animation-delay: -3s; }
      `}</style>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(12,14,20,0.8)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">
          <div style={heroStyle(0)}><Logo /></div>
          <div className="flex items-center gap-3" style={heroStyle(100)}>
            <Link
              to="/login"
              className="text-[13px] font-medium px-4 py-[7px] rounded-[8px] transition-all duration-200 hover:bg-r-s2"
              style={{ color: 'var(--text-2)' }}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-[13px] font-semibold px-4 py-[7px] rounded-[8px] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'var(--accent)', color: '#0C0E14' }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-5 pt-28 pb-24 sm:pt-36 sm:pb-32 overflow-hidden">
        {/* Parallax background layer */}
        <div style={{ transform: `translateY(${heroOffset}px)`, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <GridBg />
          <Orb size={500} x="-10%" y="-20%" opacity={0.7} speed={0.2} />
          <Orb size={400} x="60%" y="10%" opacity={0.5} speed={0.35} />
          <Orb size={300} x="30%" y="60%" opacity={0.3} speed={0.15} />
        </div>

        {/* Badge */}
        <div style={heroStyle(0)} className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-[5px] rounded-[999px] text-[11px] font-semibold mb-8 border"
            style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.25)', color: 'var(--accent)' }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full inline-block relative"
              style={{ background: 'var(--accent)' }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--accent)', animation: 'pulse-ring 1.8s ease-out infinite' }}
              />
            </span>
            Built for solo freelancers
          </div>
        </div>

        {/* Headline */}
        <h1
          className="relative z-10 text-[38px] sm:text-[56px] lg:text-[72px] font-bold tracking-tight leading-[1.08] mb-6 max-w-[820px]"
          style={heroStyle(120)}
        >
          Keep an eye on{' '}
          <span
            style={{
              color: 'var(--accent)',
              backgroundImage: 'linear-gradient(135deg, #4ADE80 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            your business
          </span>
        </h1>

        {/* Sub */}
        <p
          className="relative z-10 text-[16px] sm:text-[18px] max-w-[520px] leading-relaxed mb-10"
          style={{ color: 'var(--text-2)', ...heroStyle(220) }}
        >
          Raqib is the CRM built for freelancers. Track clients, projects, invoices,
          and follow-ups — all in one dark, distraction-free dashboard.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3" style={heroStyle(320)}>
          <Link
            to="/register"
            className="group text-[14px] font-semibold px-7 py-[13px] rounded-[10px] w-full sm:w-auto text-center transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
            style={{ background: 'var(--accent)', color: '#0C0E14', boxShadow: '0 0 0 0 rgba(74,222,128,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(74,222,128,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 0 rgba(74,222,128,0.4)'; }}
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="text-[14px] font-medium px-7 py-[13px] rounded-[10px] border w-full sm:w-auto text-center transition-all duration-200 hover:bg-r-s2"
            style={{ borderColor: 'var(--border-2)', color: 'var(--text-2)' }}
          >
            Sign in
          </Link>
        </div>

        {/* Mock dashboard — parallax float */}
        <div
          className="relative z-10 mt-20 sm:mt-24 w-full max-w-[900px]"
          style={heroStyle(420)}
        >
          <div
            className="float rounded-[20px] border overflow-hidden"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: '0 8px 0 rgba(74,222,128,0.06), 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,222,128,0.08)',
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-[6px] px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <div className="w-[11px] h-[11px] rounded-full" style={{ background: '#F87171' }} />
              <div className="w-[11px] h-[11px] rounded-full" style={{ background: '#FBBF24' }} />
              <div className="w-[11px] h-[11px] rounded-full" style={{ background: '#4ADE80' }} />
              <div
                className="flex-1 mx-3 h-[22px] rounded-[6px] flex items-center justify-center text-[11px]"
                style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}
              >
                raqib-one.vercel.app/dashboard
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[18px] sm:text-[20px] font-bold text-r-1">Dashboard</p>
                  <p className="text-[12px] text-r-3 mt-[2px]">July 2026</p>
                </div>
                <div className="px-3 py-[6px] rounded-[8px] text-[12px] font-semibold" style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--accent)' }}>
                  + New Invoice
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Total Earned', value: '$12,450', sub: '+18% this month', subColor: 'var(--accent)' },
                  { label: 'Active Projects', value: '7', sub: '2 due soon', subColor: 'var(--pending)' },
                  { label: 'Unpaid Invoices', value: '3', sub: '$4,200 pending', subColor: 'var(--text-3)' },
                  { label: 'Follow-ups Today', value: '2', sub: 'Check reminders', subColor: 'var(--text-3)' },
                ].map((s) => (
                  <div key={s.label} className="rounded-[10px] p-4 border" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                    <p className="text-[9px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-3)' }}>{s.label}</p>
                    <p className="text-[22px] font-bold text-r-1 tabular-nums">{s.value}</p>
                    <p className="text-[10px] mt-1" style={{ color: s.subColor }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-[10px] border p-4" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Earnings — Last 6 Months</p>
                  <p className="text-[12px] font-semibold" style={{ color: 'var(--accent)' }}>$12,450</p>
                </div>
                <div className="flex items-end gap-2 h-[72px]">
                  {[38, 62, 44, 78, 52, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[4px]"
                      style={{
                        height: `${h}%`,
                        background: i === 5
                          ? 'linear-gradient(180deg,#4ADE80,#22d3ee66)'
                          : 'var(--border-2)',
                        opacity: i === 5 ? 1 : 0.55,
                        animation: `bar-grow 1s cubic-bezier(0.22,1,0.36,1) ${i * 80 + 500}ms both`,
                      }}
                    />
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

          {/* Glow under the card */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-16 rounded-full"
            style={{ background: 'rgba(74,222,128,0.15)', filter: 'blur(30px)', pointerEvents: 'none' }}
          />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative px-5 sm:px-8 py-24 sm:py-32" style={{ background: 'var(--surface)' }}>
        {/* Top edge fade */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(74,222,128,0.25),transparent)' }} />

        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--accent)' }}>Everything you need</p>
              <h2 className="text-[30px] sm:text-[42px] font-bold tracking-tight">Built for the solo freelancer</h2>
              <p className="text-[15px] mt-4 max-w-[480px] mx-auto leading-relaxed" style={{ color: 'var(--text-2)' }}>
                No team features. No bloat. Just the tools you need to run your freelance business.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} from="bottom">
                <div
                  className="group rounded-[14px] p-6 border h-full transition-all duration-300 cursor-default"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(74,222,128,0.3)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4 transition-all duration-300"
                    style={{ background: 'rgba(74,222,128,0.1)' }}
                  >
                    {f.icon}
                  </div>
                  <p className="text-[14px] font-semibold text-r-1 mb-2">{f.title}</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative px-5 sm:px-8 py-24 sm:py-32 text-center overflow-hidden">
        {/* Parallax orb */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="float-slow w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />
        </div>

        <div className="relative z-10 max-w-[580px] mx-auto">
          <Reveal from="scale">
            <h2 className="text-[30px] sm:text-[44px] font-bold tracking-tight mb-5">
              Ready to take control?
            </h2>
            <p className="text-[16px] leading-relaxed mb-10" style={{ color: 'var(--text-2)' }}>
              Join freelancers who use Raqib to stay organized, follow up faster, and get paid on time.
            </p>
            <Link
              to="/register"
              className="inline-block text-[15px] font-semibold px-9 py-4 rounded-[12px] transition-all duration-200 hover:scale-[1.04]"
              style={{ background: 'var(--accent)', color: '#0C0E14' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(74,222,128,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              Create your free account →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-5 sm:px-8 py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <Logo />

          {/* Credit */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>© {new Date().getFullYear()} Raqib</p>
            <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              Designed & built by{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>Achraf Essoussy</span>
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/login" className="text-[12px] hover:text-r-1 transition-colors" style={{ color: 'var(--text-3)' }}>Sign in</Link>
            <Link to="/register" className="text-[12px] hover:text-r-1 transition-colors" style={{ color: 'var(--text-3)' }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
