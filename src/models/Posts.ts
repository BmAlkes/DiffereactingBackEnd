import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface Ipost extends Document{
    title: string;
    content:string
    author:PopulatedDoc<IUser & Document>;
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
        ref:'User'
      },
      images: [{
        type: String,  // Array de strings para armazenar URLs das imagens
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      } 
})

const Posts = mongoose.model<Ipost>("Post",PostSchema)