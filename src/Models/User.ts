import mongoose, { Document, Schema } from "mongoose";

//extender de document de mongoose
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  handle: string;
  description: string;
  image: string;
  links: string
}

const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowecase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  } ,
  description:{
    type: String,
    default:''
  },
  image:{
    type: String,
    default:''
  },
  links:{
    type: String,
    default:'[]'
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
