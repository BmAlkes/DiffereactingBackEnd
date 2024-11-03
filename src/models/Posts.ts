import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

// Define FileData interface
export interface FileData {
  name: string;
  filePath: string;
  type: string;
  size: string;
}

// Updated Post interface
export interface IPost extends Document {
  title: string;
  content: string;
  summary: string;
  author: PopulatedDoc<IUser & Document>;
  image: FileData | null;
  terms: string[];  // Array of term strings
  readTime: number;
}

// File data schema
const FileDataSchema = new Schema({
  name: String,
  filePath: String,
  type: String,
  size: String
});

// Updated Post Schema
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
    type: FileDataSchema,
    default: null
  },
  terms: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);