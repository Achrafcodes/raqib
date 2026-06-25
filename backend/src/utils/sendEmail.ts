import nodemailer from 'nodemailer';

const getTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

const FROM = `Raqib <${process.env.GMAIL_USER}>`;

export const sendReminderEmail = async (to: string, name: string, reminders: { title: string; dueDate: Date; note?: string }[]): Promise<void> => {
  const items = reminders.map((r) => {
    const due = new Date(r.dueDate);
    const label = isToday(due) ? 'Due today' : 'Due tomorrow';
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #1E2533">
        <div style="font-size:13px;font-weight:600;color:#F1F5F9">${r.title}</div>
        ${r.note ? `<div style="font-size:12px;color:#94A3B8;margin-top:2px">${r.note}</div>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1E2533;text-align:right;white-space:nowrap">
        <span style="font-size:11px;font-weight:600;color:#FBBF24;background:#2A2000;padding:2px 8px;border-radius:999px">${label}</span>
      </td>
    </tr>`;
  }).join('');

  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `You have ${reminders.length} follow-up${reminders.length > 1 ? 's' : ''} due soon`,
    html: emailTemplate({
      title: 'Upcoming follow-ups',
      body: `Hi ${name},<br><br>You have ${reminders.length} reminder${reminders.length > 1 ? 's' : ''} coming up:`,
      table: `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">${items}</table>`,
      ctaLabel: 'View Reminders',
      ctaUrl: `${process.env.CLIENT_URL}/reminders`,
      footer: "You're receiving this because you have follow-ups set in Raqib.",
    }),
  });
};

export const sendOverdueInvoiceEmail = async (to: string, name: string, invoices: { invoiceNumber: string; total: number; currency: string; clientName: string }[]): Promise<void> => {
  const items = invoices.map((inv) => `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #1E2533">
      <div style="font-size:13px;font-weight:600;color:#F1F5F9">${inv.invoiceNumber}</div>
      <div style="font-size:12px;color:#94A3B8;margin-top:2px">${inv.clientName}</div>
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #1E2533;text-align:right">
      <span style="font-size:13px;font-weight:600;color:#F87171">${inv.currency} ${inv.total.toFixed(2)}</span>
    </td>
  </tr>`).join('');

  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `${invoices.length} invoice${invoices.length > 1 ? 's are' : ' is'} overdue`,
    html: emailTemplate({
      title: 'Overdue invoices',
      body: `Hi ${name},<br><br>${invoices.length} invoice${invoices.length > 1 ? 's are' : ' is'} past due:`,
      table: `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">${items}</table>`,
      ctaLabel: 'View Invoices',
      ctaUrl: `${process.env.CLIENT_URL}/invoices`,
      footer: "You're receiving this because you have unpaid invoices in Raqib.",
    }),
  });
};

export const sendInvoiceEmail = async (
  to: string,
  name: string,
  invoice: { invoiceNumber: string; total: number; currency: string; dueDate?: string },
  pdfBuffer: Buffer
): Promise<void> => {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `Invoice ${invoice.invoiceNumber} from Raqib`,
    html: emailTemplate({
      title: `Invoice ${invoice.invoiceNumber}`,
      body: `Hi ${name},<br><br>Please find your invoice attached. Total due: <strong>${invoice.currency} ${invoice.total.toFixed(2)}</strong>${invoice.dueDate ? ` by <strong>${new Date(invoice.dueDate).toLocaleDateString()}</strong>` : ''}.`,
      table: '',
      ctaLabel: 'View Invoices',
      ctaUrl: `${process.env.CLIENT_URL}/invoices`,
      footer: 'This invoice was sent via Raqib Freelancer CRM.',
    }),
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};

// ─── helpers ─────────────────────────────────────────────────────────────────

const isToday = (d: Date): boolean => {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const emailTemplate = ({ title, body, table = '', ctaLabel, ctaUrl, footer }: {
  title: string; body: string; table?: string; ctaLabel: string; ctaUrl: string; footer: string;
}): string => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0C0E14;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0E14;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
        <tr><td style="padding-bottom:32px">
          <span style="font-size:18px;font-weight:700;color:#4ADE80;letter-spacing:-0.5px">Raqib</span>
          <span style="font-size:11px;color:#94A3B8;margin-left:6px;letter-spacing:1px;text-transform:uppercase">Freelancer CRM</span>
        </td></tr>
        <tr><td style="background:#141920;border:1px solid #1E2533;border-radius:12px;padding:32px">
          <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#F1F5F9">${title}</h1>
          <p style="margin:0 0 8px;font-size:14px;color:#94A3B8;line-height:1.6">${body}</p>
          ${table}
          <div style="margin-top:28px">
            <a href="${ctaUrl}" style="display:inline-block;background:#4ADE80;color:#0C0E14;font-size:13px;font-weight:700;padding:11px 24px;border-radius:8px;text-decoration:none">${ctaLabel}</a>
          </div>
        </td></tr>
        <tr><td style="padding-top:24px">
          <p style="margin:0;font-size:11px;color:#8899AA;line-height:1.6">${footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
