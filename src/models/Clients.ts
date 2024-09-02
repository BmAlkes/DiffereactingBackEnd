import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IProject } from "./Project";

export interface IClients extends Document {
  clientName: string;
  phone: string;
  email: string;
  bankHours: string;
  description: string;
  project: PopulatedDoc<IProject & Document>[];
}

const ClientSchema: Schema = new Schema(
  {
    clientName: {
      type: String,
      require: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    bankHours: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    active: {
      type: Boolean,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Client = mongoose.model<IClients>("Clients", ClientSchema);

export default Client;
