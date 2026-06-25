import { useState, useEffect } from 'react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import EarningsChart from '../components/charts/EarningsChart';
import PipelineChart from '../components/charts/PipelineChart';
import { SearchIcon } from '../components/ui/Icons';
import api from '../utils/api';
import type { DashboardStats } from '../types';
import { useRefresh } from '../context/RefreshContext';
import PageLoader from '../components/ui/PageLoader';


function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1).replace('.0', '')}k` : `$${n}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState('');
  const { tick } = useRefresh();

  useEffect(() => {
    api.get('/api/dashboard/stats').then((res) => setStats(res.data.data));
  }, [tick]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const statCards = [
    { label: 'Total Earned',    value: fmt(stats.totalEarned),           trendValue: 'all time',    trendText: '', trendColor: 'var(--paid)',    trendUp: true  },
    { label: 'Active Projects', value: String(stats.activeProjects),      trendValue: 'in progress', trendText: '', trendColor: 'var(--paid)',    trendUp: true  },
    { label: 'Unpaid Invoices', value: fmt(stats.unpaidInvoices),         trendValue: 'outstanding', trendText: '', trendColor: stats.unpaidInvoices > 0 ? 'var(--overdue)' : 'var(--paid)', trendUp: stats.unpaidInvoices === 0 },
    { label: 'Follow-ups Due',  value: String(stats.followUpsDueToday),   trendValue: 'due today',   trendText: '', trendColor: stats.followUpsDueToday > 0 ? 'var(--overdue)' : 'var(--paid)', trendUp: stats.followUpsDueToday === 0 },
  ];

  const pipeline = Object.entries(stats.pipelineBreakdown).map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value,
    color: label === 'lead' ? '#60A5FA' : label === 'negotiating' ? '#FBBF24' : label === 'active' ? '#4ADE80' : '#8899AA',
  }));

  const chartData = stats.earningsChart.map((d) => ({ month: d.month, value: d.earnings }));

  const filteredActivity = stats.recentActivity.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  );

  if (!stats) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-r-1 tracking-tight">Dashboard</h1>
          <p className="text-[12px] text-r-3 mt-[3px]">{today}</p>
        </div>
        <div className="flex items-center gap-2 bg-r-surface border border-r-border rounded-[8px] px-3 py-[7px] w-full sm:w-[240px]">
          <SearchIcon size={14} className="text-r-3 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity..."
            className="bg-transparent outline-none text-[13px] text-r-1 placeholder:text-r-3 w-full"
          />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[10px]">
        <div className="lg:col-span-3">
          <EarningsChart data={chartData} totalEarned={stats.totalEarned} />
        </div>
        <div className="lg:col-span-2">
          <PipelineChart segments={pipeline} />
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-r-surface border border-r-border rounded-[10px] p-6">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-semibold text-r-2 uppercase tracking-[0.08em]">Recent Activity</span>
          <span className="text-[12px] font-medium text-r-accent cursor-pointer hover:opacity-80 transition-opacity">View all →</span>
        </div>

        {filteredActivity.length === 0 ? (
          <p className="text-[13px] text-r-3 text-center py-8">No activity yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] text-left pb-3 border-b border-r-border hidden sm:table-cell">Type</th>
                <th className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] text-left pb-3 border-b border-r-border">Title</th>
                <th className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] text-left pb-3 border-b border-r-border">Status</th>
                <th className="text-[10px] font-semibold text-r-3 uppercase tracking-[0.08em] text-left pb-3 border-b border-r-border hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.map((row, i) => (
                <tr key={i} className="hover:bg-r-s2 transition-colors duration-100">
                  <td className={`py-[14px] text-[12px] font-medium text-r-3 capitalize hidden sm:table-cell ${i < filteredActivity.length - 1 ? 'border-b border-r-border' : ''}`}>{row.type}</td>
                  <td className={`py-[14px] text-[13px] font-semibold text-r-1 ${i < filteredActivity.length - 1 ? 'border-b border-r-border' : ''}`}>{row.title}</td>
                  <td className={`py-[14px] ${i < filteredActivity.length - 1 ? 'border-b border-r-border' : ''}`}><StatusBadge status={row.status} /></td>
                  <td className={`py-[14px] text-[12px] text-r-3 hidden sm:table-cell ${i < filteredActivity.length - 1 ? 'border-b border-r-border' : ''}`}>{new Date(row.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
