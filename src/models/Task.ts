import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  taskName: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  priority: string;
  deadline: string;
  assignedTask: string;
  image: object;
  alt: string;
  completedBy:{
    user:Types.ObjectId,
    status:TaskStatus
  }[]
}

const TaskSchema: Schema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    priority: {
      type: String,
      trim: true,
    },
    deadline: {
      type: String,
    },
    image: {
      type: Object,
      default:null
    },
    alt: {
      type: String,
    },
    completedBy:[{
      user:{
        type:Types.ObjectId,
        ref:'User',
        default:null
      },
      status:{
        type:String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING,
      }
    }]
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
