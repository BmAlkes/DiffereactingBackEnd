import mongoose, { Schema, Types } from "mongoose";


export interface ILeads{
    name: string;
    email: string;
    phone: string;
    message: string;
    status:[string],
}

const leadSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email: { 
        type:String,
        required: true,
    },
    phone: { 
        type:String,
        required: true,
    },
    message: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['new', 'In contact', 'convert', 'lost'],
        default: 'new'
      },
      dateOfCreation: {
        type: Date,
        default: Date.now
      },
     lastUpdate: {
        type: Date,
        default: Date.now
      }
    });
    
const Leads = mongoose.model<ILeads>('Leads',leadSchema)

export default Leads