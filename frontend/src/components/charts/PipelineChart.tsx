import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Segment { label: string; value: number; color: string }

interface Props { segments: Segment[] }

export default function PipelineChart({ segments }: Props) {
  const data = segments.filter((s) => s.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] p-6 h-full flex flex-col">
      <div className="mb-4">
        <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]">Client Pipeline</span>
        <p className="text-[11px] text-r-3 mt-[2px]">Stage breakdown</p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-[80px] h-[80px] rounded-full border-[3px] border-r-border flex items-center justify-center">
            <span className="text-[10px] text-r-3 text-center leading-tight">No<br/>clients</span>
          </div>
          <p className="text-[11px] text-r-3 mt-2">Add clients to see pipeline</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div style={{ width: 132, height: 132 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={2} strokeWidth={0}>
                  {data.map((s) => <Cell key={s.label} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full">
            {data.map((s) => (
              <div key={s.label} className="flex justify-between items-center py-[3px]">
                <div className="flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full" style={{ background: s.color }} />
                  <span className="text-[11px] text-r-2">{s.label}</span>
                </div>
                <span className="text-[11px] text-r-3 tabular-nums">
                  {Math.round((s.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
