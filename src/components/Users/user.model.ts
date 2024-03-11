import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  fullName: string
  email: string;
  phoneNo: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;

type otpPurposes = "reset_password" 

export interface IOtp extends Document {
  User: Types.ObjectId;
  code: string;
  expireAt: Date;
  purpose: otpPurposes;
  isVerified: boolean;
}

const otpSchema = new Schema<IOtp>(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
    },
    expireAt: Date,
    purpose: {
      type: String,
      enum: ["reset_password"],
      required: true,
    },
    isVerified: Boolean,
  },
  { timestamps: true }
);

export const OtpModel = model<IOtp>("Otp", otpSchema);
