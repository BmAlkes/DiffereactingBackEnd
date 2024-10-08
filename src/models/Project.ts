import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document {
  projectName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[];
  client: Types.ObjectId;
 manager: PopulatedDoc<IUser & Document>;
 team:PopulatedDoc<IUser & Document>[]
 active:boolean;
}

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: "User",
    },
   team: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    active:{
      type:Boolean
    }
  },

  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
