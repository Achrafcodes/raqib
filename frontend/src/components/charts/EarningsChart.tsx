import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { month: string; value: number }[];
  yearlyData: { month: string; value: number }[];
  totalEarned: number;
}

const RANGES = ['Monthly', 'Yearly'];

function niceMax(max: number): number {
  if (max === 0) return 1000;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * mag;
}


export default function EarningsChart({ data, yearlyData, totalEarned }: Props) {
  const [range, setRange] = useState('Monthly');

  const displayData = range === 'Yearly' ? yearlyData : data;

  const max = displayData.length ? Math.max(...displayData.map((d) => d.value)) : 0;
  const ceil = niceMax(max);
  const step = ceil / 4;
  const ticks = [0, step, step * 2, step * 3, ceil];

  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-5">
        <div>
          <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]">Earnings Overview</span>
          <p className="text-[12px] text-r-2 mt-[3px]">
            Total: <span className="text-r-1 font-medium">${totalEarned.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex bg-r-bg border border-r-border rounded-[6px] p-[2px]">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-[11px] font-medium px-[12px] py-[4px] rounded-[4px] cursor-pointer ${
                r === range ? 'bg-r-accent text-[#0C0E14]' : 'text-r-3'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <CartesianGrid horizontal vertical={false} stroke="var(--border)" strokeDasharray="0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-3)' }}
            />
            <YAxis
              domain={[0, ceil]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-3)' }}
              tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
            />
            <Tooltip
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: 'var(--text-1)' }}
              itemStyle={{ color: 'var(--text-1)' }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Earnings']}
            />
            <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
