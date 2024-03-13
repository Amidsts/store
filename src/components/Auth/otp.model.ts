import { Schema, Document, model, Types } from "mongoose";

type otpPurposes = "reset_password";

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

const OtpModel = model<IOtp>("Otp", otpSchema);
export default OtpModel