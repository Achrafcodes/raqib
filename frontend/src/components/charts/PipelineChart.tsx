import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SEGMENTS = [
  { label: 'Lead', value: 30, color: '#60A5FA' },
  { label: 'Negotiating', value: 20, color: '#FBBF24' },
  { label: 'Active', value: 35, color: '#4ADE80' },
  { label: 'Done', value: 15, color: '#475569' },
];

export default function PipelineChart() {
  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] p-6 h-full flex flex-col">
      <div className="mb-4">
        <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]">Client Pipeline</span>
        <p className="text-[11px] text-r-3 mt-[2px]">Stage breakdown</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div style={{ width: 132, height: 132 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SEGMENTS}
                dataKey="value"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={2}
                strokeWidth={0}
              >
                {SEGMENTS.map((s) => (
                  <Cell key={s.label} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full">
          {SEGMENTS.map((s) => (
            <div key={s.label} className="flex justify-between items-center py-[3px]">
              <div className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: s.color }} />
                <span className="text-[11px] text-r-2">{s.label}</span>
              </div>
              <span className="text-[11px] text-r-3 tabular-nums">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
