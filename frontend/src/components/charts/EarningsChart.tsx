import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 4100 },
  { month: 'Mar', value: 3800 },
  { month: 'Apr', value: 5200 },
  { month: 'May', value: 6000 },
  { month: 'Jun', value: 5600 },
  { month: 'Jul', value: 7400 },
  { month: 'Aug', value: 8200 },
  { month: 'Sep', value: 9100 },
  { month: 'Oct', value: 10400 },
  { month: 'Nov', value: 11800 },
  { month: 'Dec', value: 13600 },
];

const RANGES = ['Monthly', 'Yearly'];
const TICKS = [0, 3500, 7000, 10500, 14000];

export default function EarningsChart() {
  const [range, setRange] = useState('Monthly');

  return (
    <div className="bg-r-surface border border-r-border rounded-[10px] p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-5">
        <div>
          <span className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]">Earnings Overview</span>
          <p className="text-[12px] text-r-2 mt-[3px]">
            Total earnings: <span className="text-r-1 font-medium">$12,400</span>{' '}
            <span className="text-r-accent font-medium">+24%</span>
          </p>
        </div>
        <div className="flex bg-r-bg border border-r-border rounded-[6px] p-[2px]">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-[11px] font-medium px-[12px] py-[4px] rounded-[4px] ${
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
        <LineChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
          <CartesianGrid horizontal vertical={false} stroke="var(--border)" strokeDasharray="0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'var(--text-3)' }} />
          <YAxis
            domain={[0, 14000]}
            ticks={TICKS}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-3)' }}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 12,
            }}
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
