import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReminder extends Document {
  userId: Types.ObjectId;
  clientId: Types.ObjectId;
  title: string;
  note: string;
  dueDate: Date;
  isDone: boolean;
  createdAt: Date;
}

const ReminderSchema = new Schema<IReminder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  title: { type: String, required: true, trim: true },
  note: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
