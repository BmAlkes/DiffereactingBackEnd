// models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  message: string;
  type: string;
  read: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["project", "lead", "task", "other"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;