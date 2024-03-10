import { Document, Schema, Types, model } from "mongoose";

interface ITx extends Document {
  idempotencyKey: string;
  Supplier: Types.ObjectId;
  Buyer: Types.ObjectId;
  Product: Types.ObjectId;
  currency: "NGN" | "USD";
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: "pending" | "successful" | "failed";
  paymentReference: string;
  paymentLink: string;
}

const txSchema = new Schema<ITx>({
  idempotencyKey: String,
  Supplier: Schema.Types.ObjectId,
  Buyer: Schema.Types.ObjectId,
  Product: Schema.Types.ObjectId,
  currency: {
    type: String,
    enum: ["NGN", "USD"],
  },
  unitPrice: Number,
  quantity: Number,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
  },
  paymentReference: String,
  paymentLink: String,
});

const TxModel = model<ITx>("Transaction", txSchema);
export default TxModel;
