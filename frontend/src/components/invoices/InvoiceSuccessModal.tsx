import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import api from '../../utils/api';

interface Props {
  invoiceId: string;
  onClose: () => void;
}

export default function InvoiceSuccessModal({ invoiceId, onClose }: Props) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/api/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setSendError('');
    try {
      await api.post(`/api/invoices/${invoiceId}/send`);
      setSent(true);
    } catch {
      setSendError('Failed to send email. Try again.');
    } finally {
      setSending(false);
    }
  };

  const handleGoToInvoices = () => {
    onClose();
    navigate('/invoices');
  };

  return (
    <Modal title="Invoice Created" onClose={onClose}>
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.12)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-bold text-r-1">Invoice created</p>
            <p className="text-[12px] text-r-3 mt-[3px]">What would you like to do next?</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">{downloading ? 'Downloading…' : 'Download PDF'}</p>
              <p className="text-[11px] text-r-3">Save invoice as a PDF file</p>
            </div>
          </button>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sent ? 'var(--accent)' : 'var(--text-2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sent
                ? <polyline points="20 6 9 17 4 12" />
                : <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>}
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">{sending ? 'Sending…' : sent ? 'Sent!' : 'Send by email'}</p>
              <p className="text-[11px] text-r-3">{sent ? 'Invoice emailed to client' : 'Email PDF directly to client'}</p>
            </div>
          </button>

          {sendError && <p className="text-[11px] px-1" style={{ color: 'var(--overdue)' }}>{sendError}</p>}

          <button
            onClick={handleGoToInvoices}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border text-left transition-colors cursor-pointer hover:border-r-border-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-r-1">Go to Invoices</p>
              <p className="text-[11px] text-r-3">View and manage all invoices</p>
            </div>
          </button>
        </div>

        <button onClick={onClose} className="text-[12px] text-r-3 hover:text-r-1 transition-colors cursor-pointer text-center">
          Close
        </button>
      </div>
    </Modal>
  );
}
