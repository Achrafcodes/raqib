import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EarningsChart from '../components/charts/EarningsChart';
import PipelineChart from '../components/charts/PipelineChart';
import { SearchIcon } from '../components/ui/Icons';

const STATS = [
  { label: 'Total Earned',    value: '$12,400', trendValue: '+24%',     trendText: 'this month', trendColor: 'var(--paid)',    trendUp: true  },
  { label: 'Active Projects', value: '5',        trendValue: '+2 new',   trendText: 'this month', trendColor: 'var(--paid)',    trendUp: true  },
  { label: 'Unpaid Invoices', value: '$2,800',   trendValue: '4 unpaid', trendText: 'invoices',   trendColor: 'var(--overdue)', trendUp: false },
  { label: 'Follow-ups Due',  value: '3',        trendValue: 'today',    trendText: 'due today',  trendColor: 'var(--overdue)', trendUp: false },
];

type Status = 'paid' | 'pending' | 'overdue' | 'lead' | 'lost';

const ACTIVITY: { client: string; project: string; amount: string; status: Status }[] = [
  { client: 'Ahmed Samir', project: 'Brand Identity',   amount: '$1,200', status: 'paid'    },
  { client: 'Sara Mendez', project: 'Web Development',  amount: '$3,400', status: 'pending' },
  { client: 'John Davies', project: 'SEO Campaign',     amount: '$800',   status: 'overdue' },
  { client: 'Lina Chen',   project: 'Mobile App UI',    amount: '$2,100', status: 'paid'    },
  { client: 'Omar Hassan', project: 'Content Strategy', amount: '$650',   status: 'lead'    },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-5">
      {/* A. PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 tracking-tight">Dashboard</h1>
          <p className="text-[12px] text-r-3 mt-[3px]">{today}</p>
        </div>
        <div className="flex items-center gap-2 bg-r-surface border border-r-border rounded-[8px] px-3 py-[7px] w-[240px]">
          <SearchIcon size={14} className="text-r-3 shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-[13px] text-r-1 placeholder:text-r-3 w-full"
          />
        </div>
      </div>

      {/* B. STAT CARDS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* C. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[10px]">
        <div className="lg:col-span-3">
          <EarningsChart />
        </div>
        <div className="lg:col-span-2">
          <PipelineChart />
        </div>
      </div>

      {/* D. RECENT ACTIVITY TABLE */}
      <div className="bg-r-surface border border-r-border rounded-[10px] p-6">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-semibold text-r-2 uppercase tracking-[0.08em]">Recent Activity</span>
          <span className="text-[12px] font-medium text-r-accent cursor-pointer hover:opacity-80 transition-opacity">View all →</span>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Client', 'Project', 'Amount', 'Status', 'Action'].map((h) => (
                <th
                  key={h}
                  className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] text-left pb-3 border-b border-r-border"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map((row, i) => (
              <tr key={row.client} className="group hover:bg-r-s2 transition-colors duration-100">
                <td className={`py-[14px] ${i < ACTIVITY.length - 1 ? 'border-b border-r-border' : ''}`}>
                  <div className="flex items-center gap-[10px]">
                    <Avatar name={row.client} />
                    <span className="text-[13px] font-semibold text-r-1">{row.client}</span>
                  </div>
                </td>
                <td className={`py-[14px] text-[13px] text-r-3 ${i < ACTIVITY.length - 1 ? 'border-b border-r-border' : ''}`}>
                  {row.project}
                </td>
                <td className={`py-[14px] text-[13px] font-semibold text-r-1 tabular-nums ${i < ACTIVITY.length - 1 ? 'border-b border-r-border' : ''}`}>
                  {row.amount}
                </td>
                <td className={`py-[14px] ${i < ACTIVITY.length - 1 ? 'border-b border-r-border' : ''}`}>
                  <StatusBadge status={row.status} />
                </td>
                <td className={`py-[14px] ${i < ACTIVITY.length - 1 ? 'border-b border-r-border' : ''}`}>
                  <span className="text-[16px] leading-none text-r-3 hover:text-r-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">···</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
