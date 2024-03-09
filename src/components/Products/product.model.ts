import { Schema, Document, model, Types } from "mongoose";

interface IProduct extends Document {
    name: string
    category: string,
    price: number,
    quantity: number
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: {
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

const ProductModel = model<IProduct>("Product", productSchema)
export default ProductModel