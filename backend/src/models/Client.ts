import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClient extends Document {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'upwork' | 'fiverr' | 'instagram' | 'referral' | 'cold-email' | 'other';
  status: 'lead' | 'negotiating' | 'active' | 'done' | 'lost';
  notes: string;
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  source: {
    type: String,
    enum: ['upwork', 'fiverr', 'instagram', 'referral', 'cold-email', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['lead', 'negotiating', 'active', 'done', 'lost'],
    default: 'lead',
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClient>('Client', ClientSchema);
