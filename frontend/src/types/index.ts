export interface User {
  id: string;
  name: string;
  email: string;
  freelanceTitle: string;
  currency: string;
  isEmailVerified: boolean;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'upwork' | 'fiverr' | 'instagram' | 'referral' | 'cold-email' | 'other';
  status: 'lead' | 'negotiating' | 'active' | 'done' | 'lost';
  notes: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  clientId: { _id: string; name: string; email: string } | string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: 'not-started' | 'in-progress' | 'review' | 'done' | 'cancelled';
  deadline: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  clientId: { _id: string; name: string; email: string } | string;
  projectId: { _id: string; title: string } | string | null;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  paidAt: string;
  createdAt: string;
}

export interface Reminder {
  _id: string;
  clientId: { _id: string; name: string } | string | null;
  title: string;
  note: string;
  dueDate: string;
  isDone: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEarned: number;
  activeProjects: number;
  unpaidInvoices: number;
  followUpsDueToday: number;
  earningsChart: { month: string; earnings: number }[];
  earningsYearlyChart: { month: string; earnings: number }[];
  pipelineBreakdown: Record<string, number>;
  recentActivity: { type: string; title: string; status: string; date: string }[];
}
