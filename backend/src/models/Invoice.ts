import mongoose, { Document, Schema, Types } from 'mongoose';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  userId: Types.ObjectId;
  clientId: Types.ObjectId;
  projectId: Types.ObjectId;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  paidAt: Date;
  createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  invoiceNumber: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft',
  },
  dueDate: { type: Date },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
