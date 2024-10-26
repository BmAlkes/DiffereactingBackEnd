import mongoose, { Schema, Types } from "mongoose";

export interface INotification {
  type: [string];
  leadId: Types.ObjectId;
  read: boolean;
  createDate: string;
}

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['New_lead', 'lead_updated'],
      required: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leads',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
   createDate: {
      type: Date,
      default: Date.now
    },
    expiresAt:{
      type:Date,
      default:Date.now(),
      expires:"24h"
  }
  }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
