import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  userId: Types.ObjectId;
  clientId: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: 'not-started' | 'in-progress' | 'review' | 'done' | 'cancelled';
  deadline: Date;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'review', 'done', 'cancelled'],
    default: 'not-started',
  },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
