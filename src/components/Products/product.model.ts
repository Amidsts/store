import { Schema, Document, model, Types } from "mongoose";

interface IProduct extends Document {
  User: Types.ObjectId;
  name: string;
  category: string;
  description: string;
  price: number;
  quantityInStock: number;
}

const productSchema = new Schema<IProduct>({
  User: {type: Schema.Types.ObjectId, ref: "User"},
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
  quantityInStock: {
    type: Number,
    required: true,
  },
}, {timestamps: true});


const ProductModel = model<IProduct>("Product", productSchema)
export default ProductModel