// models/events.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  user: mongoose.Types.ObjectId | string;
  title: string;
  date: Date;
  description?: string;
  category: 'Work' | 'Personal' | 'Important' | 'Meeting' | 'Others';
  reminder: boolean;
  reminderTime: string;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Important', 'Meeting', 'Others'],
    default: 'Others'
  },
  reminder: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: String,
    default: '30'
  },
  notified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', eventSchema);