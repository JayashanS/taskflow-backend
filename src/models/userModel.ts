import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  role: "admin" | "user";
  isEnabled: boolean;
  otp?: string | null;
  otpExpiration?: Date | null;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiration: {
    type: Date,
    default: null,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
