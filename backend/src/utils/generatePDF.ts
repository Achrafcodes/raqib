import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PDFInvoiceData {
  invoiceNumber: string;
  status: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  subtotal: number;
  tax: number;
  total: number;
  items: LineItem[];
  currency: string;
  freelancerName: string;
  freelanceTitle?: string;
  clientName: string;
  clientEmail?: string;
  projectTitle?: string;
}

const C = {
  bg:      rgb(0.047, 0.055, 0.078),   // #0C0E14
  surface: rgb(0.078, 0.098, 0.125),   // #141920
  border:  rgb(0.118, 0.145, 0.2),     // #1E2533
  accent:  rgb(0.290, 0.871, 0.502),   // #4ADE80
  text1:   rgb(0.945, 0.961, 0.984),   // #F1F5F9
  text2:   rgb(0.580, 0.639, 0.722),   // #94A3B8
  text3:   rgb(0.533, 0.600, 0.667),   // #8899AA
  paid:    rgb(0.290, 0.871, 0.502),
  pending: rgb(0.984, 0.749, 0.141),   // #FBBF24
  overdue: rgb(0.973, 0.443, 0.443),   // #F87171
  draft:   rgb(0.580, 0.639, 0.722),
  sent:    rgb(0.376, 0.647, 0.980),   // #60A5FA
};

function statusColor(status: string) {
  const map: Record<string, ReturnType<typeof rgb>> = {
    paid: C.paid, pending: C.pending, overdue: C.overdue, draft: C.draft, sent: C.sent,
  };
  return map[status] ?? C.text3;
}

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMoney(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n);
}

function drawRect(page: ReturnType<PDFDocument['addPage']>, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

function drawLine(page: ReturnType<PDFDocument['addPage']>, x1: number, y1: number, x2: number, y2: number, color: ReturnType<typeof rgb>, thickness = 0.5) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
}

export async function generateInvoicePDF(data: PDFInvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg  = await doc.embedFont(StandardFonts.Helvetica);

  const PAD = 48;
  const COL_W = width - PAD * 2; // 499

  // ── Background ──────────────────────────────────────────────────
  drawRect(page, 0, 0, width, height, C.bg);

  // ── Header bar ──────────────────────────────────────────────────
  drawRect(page, 0, height - 90, width, 90, C.surface);
  drawLine(page, 0, height - 90, width, height - 90, C.border);

  // Spark logo polyline (scaled, top-left)
  const lx = PAD, ly = height - 52;
  const pts = [[0,0],[8,-8],[14,-4],[22,-14],[30,-10],[40,-18]].map(([dx,dy]) => ({ x: lx+dx*0.7, y: ly+dy*0.7 }));
  for (let i = 0; i < pts.length - 1; i++) {
    page.drawLine({ start: pts[i], end: pts[i+1], thickness: 1.8, color: C.accent });
  }
  page.drawCircle({ x: pts[pts.length-1].x, y: pts[pts.length-1].y, size: 2.5, color: C.accent });

  // "INVOICE" label
  page.drawText('INVOICE', { x: PAD + 36, y: height - 50, font: bold, size: 18, color: C.text1 });

  // Invoice number (right)
  const invNumW = bold.widthOfTextAtSize(data.invoiceNumber, 11);
  page.drawText(data.invoiceNumber, { x: width - PAD - invNumW, y: height - 44, font: bold, size: 11, color: C.accent });
  const statusLabel = data.status.toUpperCase();
  const statusW = bold.widthOfTextAtSize(statusLabel, 8);
  page.drawText(statusLabel, { x: width - PAD - statusW, y: height - 57, font: bold, size: 8, color: statusColor(data.status) });

  // ── From / To / Meta ────────────────────────────────────────────
  let y = height - 120;

  // FROM
  page.drawText('FROM', { x: PAD, y, font: bold, size: 7, color: C.text3 });
  y -= 14;
  page.drawText(data.freelancerName, { x: PAD, y, font: bold, size: 11, color: C.text1 });
  if (data.freelanceTitle) {
    y -= 13;
    page.drawText(data.freelanceTitle, { x: PAD, y, font: reg, size: 9, color: C.text2 });
  }

  // TO (middle column)
  const toX = PAD + COL_W / 3;
  let ty = height - 120;
  page.drawText('BILL TO', { x: toX, y: ty, font: bold, size: 7, color: C.text3 });
  ty -= 14;
  page.drawText(data.clientName, { x: toX, y: ty, font: bold, size: 11, color: C.text1 });
  if (data.clientEmail) {
    ty -= 13;
    page.drawText(data.clientEmail, { x: toX, y: ty, font: reg, size: 9, color: C.text2 });
  }
  if (data.projectTitle) {
    ty -= 13;
    page.drawText(`Project: ${data.projectTitle}`, { x: toX, y: ty, font: reg, size: 9, color: C.text2 });
  }

  // META (right column)
  const metaX = PAD + (COL_W * 2) / 3;
  let my = height - 120;
  const metaRows = [
    { label: 'Issued', value: fmtDate(data.createdAt) },
    { label: 'Due', value: fmtDate(data.dueDate) },
    ...(data.paidAt ? [{ label: 'Paid', value: fmtDate(data.paidAt) }] : []),
  ];
  for (const row of metaRows) {
    page.drawText(row.label.toUpperCase(), { x: metaX, y: my, font: bold, size: 7, color: C.text3 });
    page.drawText(row.value, { x: metaX + 48, y: my, font: reg, size: 9, color: C.text1 });
    my -= 14;
  }

  // ── Divider ──────────────────────────────────────────────────────
  y = Math.min(y, ty, my) - 20;
  drawLine(page, PAD, y, width - PAD, y, C.border);
  y -= 20;

  // ── Line items table ─────────────────────────────────────────────
  const COL = {
    desc: PAD,
    qty:  PAD + COL_W * 0.55,
    unit: PAD + COL_W * 0.70,
    tot:  PAD + COL_W * 0.85,
  };

  // Table header
  drawRect(page, PAD, y - 2, COL_W, 22, C.surface);
  page.drawText('DESCRIPTION', { x: COL.desc + 8, y: y + 6, font: bold, size: 7, color: C.text3 });
  page.drawText('QTY',  { x: COL.qty,  y: y + 6, font: bold, size: 7, color: C.text3 });
  page.drawText('UNIT', { x: COL.unit, y: y + 6, font: bold, size: 7, color: C.text3 });
  page.drawText('TOTAL', { x: COL.tot, y: y + 6, font: bold, size: 7, color: C.text3 });
  y -= 4;
  drawLine(page, PAD, y, width - PAD, y, C.border);
  y -= 4;

  // Rows
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    y -= 24;
    if (i % 2 === 1) drawRect(page, PAD, y - 4, COL_W, 22, rgb(0.059, 0.071, 0.098));

    // Wrap long descriptions
    const maxDescW = COL.qty - COL.desc - 12;
    let desc = item.description;
    const words = desc.split(' ');
    let line = '';
    const lines: string[] = [];
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (reg.widthOfTextAtSize(test, 9) > maxDescW) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);

    page.drawText(lines[0] ?? '', { x: COL.desc + 8, y: y + 6, font: reg, size: 9, color: C.text1 });
    if (lines[1]) page.drawText(lines[1], { x: COL.desc + 8, y: y - 5, font: reg, size: 8, color: C.text2 });

    page.drawText(String(item.quantity), { x: COL.qty,  y: y + 6, font: reg, size: 9, color: C.text1 });
    page.drawText(fmtMoney(item.unitPrice, data.currency), { x: COL.unit, y: y + 6, font: reg, size: 9, color: C.text1 });
    const totStr = fmtMoney(item.total, data.currency);
    const totW = reg.widthOfTextAtSize(totStr, 9);
    page.drawText(totStr, { x: width - PAD - totW, y: y + 6, font: bold, size: 9, color: C.text1 });

    y -= (lines.length > 1 ? 8 : 0);
  }

  y -= 8;
  drawLine(page, PAD, y, width - PAD, y, C.border);

  // ── Totals ───────────────────────────────────────────────────────
  y -= 16;
  const totalsX = PAD + COL_W * 0.6;
  const valX = width - PAD;

  const totalRows: { label: string; value: string; big?: boolean; color?: ReturnType<typeof rgb> }[] = [
    { label: 'Subtotal', value: fmtMoney(data.subtotal, data.currency) },
    ...(data.tax > 0 ? [{ label: `Tax (${data.tax}%)`, value: fmtMoney(data.subtotal * data.tax / 100, data.currency) }] : []),
  ];

  for (const row of totalRows) {
    page.drawText(row.label, { x: totalsX, y, font: reg, size: 9, color: C.text2 });
    const vw = reg.widthOfTextAtSize(row.value, 9);
    page.drawText(row.value, { x: valX - vw, y, font: reg, size: 9, color: C.text1 });
    y -= 20;
  }

  // Total row — highlighted
  y -= 4;
  drawRect(page, totalsX - 8, y - 8, width - PAD - totalsX + 8, 30, C.surface);
  drawLine(page, totalsX - 8, y + 22, width - PAD, y + 22, C.border);
  page.drawText('TOTAL', { x: totalsX, y: y + 7, font: bold, size: 10, color: C.text1 });
  const totalStr = fmtMoney(data.total, data.currency);
  const totalW = bold.widthOfTextAtSize(totalStr, 12);
  page.drawText(totalStr, { x: valX - totalW, y: y + 5, font: bold, size: 12, color: C.accent });
  y -= 36;

  // ── Footer ───────────────────────────────────────────────────────
  drawLine(page, PAD, 60, width - PAD, 60, C.border);
  page.drawText('Generated by Raqib · Freelancer CRM', {
    x: PAD, y: 42, font: reg, size: 8, color: C.text3,
  });
  const dateStr = `Generated ${fmtDate(new Date().toISOString())}`;
  const dsW = reg.widthOfTextAtSize(dateStr, 8);
  page.drawText(dateStr, { x: width - PAD - dsW, y: 42, font: reg, size: 8, color: C.text3 });

  return doc.save();
}
