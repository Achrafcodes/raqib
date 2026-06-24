import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EarningsChart from '../components/charts/EarningsChart';
import PipelineChart from '../components/charts/PipelineChart';
import type { DashboardStats, Invoice, Client, Project } from '../types';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [chartMode, setChartMode] = useState<'Monthly' | 'Yearly'>('Monthly');

  useEffect(() => {
    api.get('/api/dashboard/stats').then((r) => setStats(r.data.data));
    api.get('/api/invoices').then((r) => setInvoices(r.data.data.slice(0, 6)));
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const getClientName = (inv: Invoice) =>
    typeof inv.clientId === 'object' && inv.clientId ? (inv.clientId as Client).name : '—';
  const getProjectTitle = (inv: Invoice) =>
    inv.projectId && typeof inv.projectId === 'object' ? (inv.projectId as Project).title : '—';

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-5 fade-up">
        <h1 className="text-[18px] font-semibold text-raqib-text tracking-tight">
          {user ? `${user.name.split(' ')[0]}'s Dashboard` : 'Dashboard'}
        </h1>
        <span className="text-[12px] text-raqib-muted">{today}</span>
      </div>

      {/* Stat bar — signature element: one unified block, hairline dividers */}
      <div className="bg-raqib-surface border border-raqib-border rounded-[6px] grid grid-cols-4 divide-x divide-raqib-border mb-5 fade-up">
        <StatCard
          label="Total Earned"
          prefix="$"
          value={stats?.totalEarned ?? 0}
          sub="↑ 24% this month"
          subColor="accent"
        />
        <StatCard
          label="Active Projects"
          value={stats?.activeProjects ?? 0}
          sub="+2 new this month"
          subColor="muted"
        />
        <StatCard
          label="Unpaid Invoices"
          value={stats?.unpaidInvoices ?? 0}
          sub="awaiting payment"
          subColor="overdue"
        />
        <StatCard
          label="Follow-ups Due"
          value={stats?.followUpsDueToday ?? 0}
          sub="due today"
          subColor="muted"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-[3fr_2fr] gap-4 mb-5 fade-up">
        <div className="bg-raqib-surface border border-raqib-border rounded-[6px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em]">Earnings Overview</p>
              {stats && (
                <p className="text-[12px] text-raqib-muted mt-0.5">
                  ${stats.totalEarned.toLocaleString()} total{' '}
                  <span className="text-raqib-accent">+24%</span>
                </p>
              )}
            </div>
            <div className="flex border border-raqib-border rounded-[4px] overflow-hidden">
              {(['Monthly', 'Yearly'] as const).map((m) => (
                <button key={m} onClick={() => setChartMode(m)}
                  className={`text-[11px] font-medium px-3 py-1.5 transition-colors ${
                    chartMode === m ? 'bg-raqib-accent text-[#0B0F1A]' : 'text-raqib-muted hover:text-raqib-text'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          {stats
            ? <EarningsChart data={stats.earningsChart} />
            : <div className="h-[180px] flex items-center justify-center"><p className="text-[12px] text-raqib-muted">Loading…</p></div>
          }
        </div>

        <div className="bg-raqib-surface border border-raqib-border rounded-[6px] p-5">
          <p className="text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em] mb-1">Client Pipeline</p>
          <p className="text-[12px] text-raqib-muted mb-4">Stage breakdown</p>
          <div className="h-[180px]">
            {stats
              ? <PipelineChart data={stats.pipelineBreakdown} />
              : <div className="flex items-center justify-center h-full"><p className="text-[12px] text-raqib-muted">Loading…</p></div>
            }
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-raqib-surface border border-raqib-border rounded-[6px] fade-up">
        <div className="flex items-center justify-between px-5 py-3 border-b border-raqib-border">
          <p className="text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em]">Recent Activity</p>
          <button onClick={() => navigate('/invoices')} className="text-[11px] text-raqib-accent hover:underline">View all →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-raqib-border">
              {['Client', 'Project', 'Amount', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-[10px] font-medium text-raqib-muted uppercase tracking-[0.12em] px-5 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-[13px] text-raqib-muted text-center">No invoices yet — create your first</td></tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b border-raqib-border last:border-0 hover:bg-raqib-bg transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={getClientName(inv)} size="sm" />
                    <span className="text-[13px] text-raqib-text">{getClientName(inv)}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px] text-raqib-muted">{getProjectTitle(inv)}</td>
                <td className="px-5 py-3 num text-[13px] text-raqib-text">${inv.total.toLocaleString()}</td>
                <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-5 py-3">
                  <button onClick={() => navigate('/invoices')} className="text-[13px] text-raqib-muted hover:text-raqib-text transition-colors tracking-widest">···</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
