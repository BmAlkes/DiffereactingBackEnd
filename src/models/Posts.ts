import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface Ipost extends Document {
  title: string;
  content: string;
  summery: string;
  author: PopulatedDoc<IUser & Document>;
  image: object;
}

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
  },
  summary: {
    type: String,
  },
  image: {
    type: Object,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Posts = mongoose.model<Ipost>("Post", PostSchema);
