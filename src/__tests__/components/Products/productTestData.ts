import ProductModel from "../../../components/Products/product.model";

export const productTestData = {
  name: "sneakers",
  category: "footwear",
  description: "nsdb ekq qkf",
  price: 200,
  quantityInStock: 15,
};

export function saveProductTestData() {
  return {
    product: (userId: string) =>
      new ProductModel({ ...productTestData, User: userId }),
  };
}
