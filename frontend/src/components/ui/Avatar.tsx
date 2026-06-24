const COLORS = ['#1E3A5F', '#3D1F5F', '#3D2B1F', '#1F3D2B', '#3D3D1F'];

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name }: { name: string }) {
  return (
    <span
      className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
      style={{ background: colorFor(name) }}
    >
      {initials(name)}
    </span>
  );
}
