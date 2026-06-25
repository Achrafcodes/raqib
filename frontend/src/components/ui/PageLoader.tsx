export default function PageLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5"
      style={{ minHeight: '60vh' }}
    >
      <div
        className="w-[56px] h-[56px] rounded-[14px] flex items-center justify-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)' }}
      >
        <svg width="34" height="24" viewBox="0 0 22 16" fill="none">
          <polyline
            points="1,13 5,9 8,11 12,5 16,7 21,1"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: 'pl-draw 1.1s ease forwards',
            }}
          />
          <circle
            cx="21" cy="1" r="2" fill="#4ADE80"
            style={{ opacity: 0, animation: 'pl-dot 0.3s ease 1s forwards' }}
          />
          <line x1="1" y1="15" x2="21" y2="15" stroke="#2D3748" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div
        className="flex gap-[5px]"
        style={{ opacity: 0, animation: 'pl-fade 0.3s ease 0.8s forwards' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[5px] h-[5px] rounded-full"
            style={{
              background: 'var(--accent)',
              opacity: 0.3,
              animation: `pl-pulse 1.1s ease ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pl-draw  { to { stroke-dashoffset: 0; } }
        @keyframes pl-dot   { to { opacity: 1; } }
        @keyframes pl-fade  { to { opacity: 1; } }
        @keyframes pl-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
