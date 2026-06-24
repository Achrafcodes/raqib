import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { month: string; earnings: number }[];
}

const formatY = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

export default function EarningsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1F2937" strokeDasharray="0" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatY}
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#161B27', border: '1px solid #1F2937', borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: '#6B7280' }}
          itemStyle={{ color: '#4ADE80' }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, 'Earnings']}
        />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#4ADE80"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: '#4ADE80' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
