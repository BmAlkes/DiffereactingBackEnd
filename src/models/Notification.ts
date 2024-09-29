import mongoose, { Schema, Types } from "mongoose";

export interface INotification {
  userId: string;
  projectId: string;
  message: string;
  isRead: boolean;
}

const notificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    projectId: { type: Types.ObjectId, ref: "Project" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default notification;
