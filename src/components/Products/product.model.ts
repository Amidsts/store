import { Schema, Document, model, Types } from "mongoose";

interface IProduct extends Document {
  User: Types.ObjectId;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
}

const productSchema = new Schema<IProduct>({
  User: Schema.Types.ObjectId,
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

productSchema.index({
  productName: "text",
  category: "text",
  description: "text",
});

const ProductModel = model<IProduct>("Product", productSchema)
export default ProductModel