export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: 'var(--bg)' }}
    >
      {/* Animated spark logo */}
      <div
        className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="44" height="32" viewBox="0 0 22 16" fill="none">
          <polyline
            points="1,13 5,9 8,11 12,5 16,7 21,1"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: 'draw-line 1.2s ease forwards',
            }}
          />
          <circle
            cx="21"
            cy="1"
            r="2"
            fill="#4ADE80"
            style={{ opacity: 0, animation: 'fade-dot 0.3s ease 1.1s forwards' }}
          />
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col items-center gap-[4px]" style={{ opacity: 0, animation: 'fade-in 0.4s ease 0.6s forwards' }}>
        <span className="text-[20px] font-bold text-r-1 tracking-tight">Raqib</span>
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'var(--accent)', opacity: 0.7 }}>
          Freelancer CRM
        </span>
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-[6px]" style={{ opacity: 0, animation: 'fade-in 0.4s ease 1.2s forwards' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[5px] h-[5px] rounded-full"
            style={{
              background: 'var(--accent)',
              opacity: 0.3,
              animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-dot {
          to { opacity: 1; }
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
