import { Response } from 'express';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';
import { generateInvoicePDF } from '../utils/generatePDF.js';
import { sendInvoiceEmail } from '../utils/sendEmail.js';

const getNextInvoiceNumber = async (userId: string): Promise<string> => {
  const count = await Invoice.countDocuments({ userId });
  return `INV-${String(count + 1).padStart(3, '0')}`;
};

export const getInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.find({ userId: req.user?.id })
      .populate('clientId', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

const validateInvoiceNumbers = (subtotal: number, tax: number, total: number): string | null => {
  if (typeof subtotal !== 'number' || subtotal < 0) return 'subtotal must be a non-negative number';
  if (typeof tax !== 'number' || tax < 0 || tax > 100) return 'tax must be between 0 and 100';
  if (typeof total !== 'number' || total < 0) return 'total must be a non-negative number';
  return null;
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, projectId, items, subtotal, tax, total, status, dueDate } = req.body;
    const validationError = validateInvoiceNumbers(subtotal, tax, total);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }
    const invoiceNumber = await getNextInvoiceNumber(req.user?.id as string);
    const invoice = await Invoice.create({ clientId, projectId, items, subtotal, tax, total, status, dueDate, userId: req.user?.id, invoiceNumber });
    res.status(201).json({ success: true, data: invoice });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create invoice' });
  }
};

export const getInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate('clientId', 'name email')
      .populate('projectId', 'title');
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, projectId, items, subtotal, tax, total, status, dueDate, paidAt } = req.body;
    if (subtotal !== undefined || tax !== undefined || total !== undefined) {
      const validationError = validateInvoiceNumbers(subtotal ?? 0, tax ?? 0, total ?? 0);
      if (validationError) {
        res.status(400).json({ success: false, message: validationError });
        return;
      }
    }
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { clientId, projectId, items, subtotal, tax, total, status, dueDate, paidAt },
      { new: true, runValidators: true }
    );
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update invoice' });
  }
};

export const downloadInvoicePDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate('clientId', 'name email')
      .populate('projectId', 'title');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    const user = await User.findById(req.user?.id).select('name freelanceTitle currency');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const client = invoice.clientId as unknown as { name: string; email?: string } | null;
    const project = invoice.projectId as unknown as { title: string } | null;

    const pdfBytes = await generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      dueDate: invoice.dueDate?.toISOString(),
      paidAt: invoice.paidAt?.toISOString(),
      createdAt: invoice.createdAt.toISOString(),
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      currency: user.currency ?? 'USD',
      freelancerName: user.name,
      freelanceTitle: user.freelanceTitle,
      clientName: client?.name ?? 'Unknown',
      clientEmail: client?.email,
      projectTitle: project?.title,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBytes.length);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};

export const sendInvoiceByEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user?.id })
      .populate('clientId', 'name email')
      .populate('projectId', 'title');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    const client = invoice.clientId as unknown as { name: string; email?: string } | null;
    if (!client?.email) {
      res.status(400).json({ success: false, message: 'Client has no email address' });
      return;
    }

    const user = await User.findById(req.user?.id).select('name freelanceTitle currency');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const project = invoice.projectId as unknown as { title: string } | null;
    const pdfBytes = await generateInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      dueDate: invoice.dueDate?.toISOString(),
      paidAt: invoice.paidAt?.toISOString(),
      createdAt: invoice.createdAt.toISOString(),
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      currency: user.currency ?? 'USD',
      freelancerName: user.name,
      freelanceTitle: user.freelanceTitle,
      clientName: client.name,
      clientEmail: client.email,
      projectTitle: project?.title,
    });

    await sendInvoiceEmail(client.email, client.name, {
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      currency: user.currency ?? 'USD',
      dueDate: invoice.dueDate?.toISOString(),
    }, Buffer.from(pdfBytes));

    res.json({ success: true, data: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send invoice email' });
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
};
