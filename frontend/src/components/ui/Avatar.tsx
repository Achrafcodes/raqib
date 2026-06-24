const palette = ['#374151', '#1E3A5F', '#3D2B1F', '#1F3A2F', '#2D1F3A', '#3A1F2B'];

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const getBg = (name: string) => palette[name.charCodeAt(0) % palette.length];

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

export default function Avatar({ name, size = 'sm' }: AvatarProps) {
  const dim = size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-8 h-8 text-[12px]';
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-medium text-white flex-shrink-0`}
      style={{ backgroundColor: getBg(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
