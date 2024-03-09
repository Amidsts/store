import { Schema, Document, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

import appConfig from "../../configs";
import { IToken } from "../../utils/types";

const { authConfigs, hashPepper } = appConfig;

export interface IAuth extends Document {
  User: Types.ObjectId;
  password: string;
  role: "user" | "admin";
  acctStatus: "active" | "suspended";

  comparePassword: (password: string) => any;
  generateToken: (token: { [key: string]: any }) => any;
  randomOTP: () => any;
}

const authSchema = new Schema<IAuth>(
  {
    User: { type: Schema.Types.ObjectId, ref: "User" },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    acctStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

authSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password + hashPepper, this.password);
};

authSchema.methods.generateToken = ({
  data,
  expiresIn = authConfigs.tokenLifeSpan,
  audience = "web",
}: {
  data: IToken;
  expiresIn?: number;
  audience?: "web";
}): string =>
  jwt.sign(data, authConfigs.jwtSecret, {
    expiresIn,
    issuer: `store-${appConfig.environment}`,
    audience: `${audience}-user`,
  });

authSchema.methods.randomOTP = (): string => randomBytes(3).toString("hex");

authSchema.pre<IAuth>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(authConfigs.saltRounds);

      const hashedPassword = await bcrypt.hash(
        this.password + hashPepper,
        salt
      );
      this.password = hashedPassword;
    }

    next();
  } catch (err) {
    return next(err);
  }
});

const AuthModel = model<IAuth>("Auth", authSchema);

export default AuthModel;
