import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document{
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
    profileImage: object;
}

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        lowerCase: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    profileImage:{
        type: Object,
        default:null
    }
    
})

const User  = mongoose.model<IUser>('User', userSchema)
export default User;