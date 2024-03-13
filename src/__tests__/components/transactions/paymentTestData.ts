import mongoose from "mongoose";
import TxModel from "../../../components/transactions/transaction.model";
import { IProduct } from "../../../components/Products/product.model";

export const paymentData = (productId: string) => ({
  idempotencyKey: "ajhuqhgewlwDBJHBG",
  productId,
  currency: "NGN",
  quantity: 2,
});

export function saveTxTestData() {
  return {
    transaction: (product: IProduct, userId: string) =>
      new TxModel({
        Product: product._id,
        idempotencyKey: paymentData(product._id).idempotencyKey,
        status: "successful",
        Supplier: new mongoose.Types.ObjectId(),
        Buyer: userId,
        currency: paymentData(product._id).currency,
        unitPrice: product.price,
        quantity: paymentData(product._id).quantity,
      }),
  };
}
