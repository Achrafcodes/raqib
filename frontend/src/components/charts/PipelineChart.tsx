import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  lead:         '#60A5FA',
  negotiating:  '#FBBF24',
  active:       '#4ADE80',
  done:         '#6B7280',
  lost:         '#374151',
};

export default function PipelineChart({ data }: Props) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);

  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: key, value }));

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[12px] text-raqib-muted">No project data yet</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 h-full">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#6B7280'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#161B27', border: '1px solid #1F2937', borderRadius: 6, fontSize: 12 }}
            itemStyle={{ color: '#F9FAFB' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] ?? '#6B7280' }} />
              <span className="text-[12px] text-raqib-text capitalize">{entry.name}</span>
            </div>
            <span className="text-[12px] text-raqib-muted">
              {Math.round((entry.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
