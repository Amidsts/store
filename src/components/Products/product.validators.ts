import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number(),
  quantityInStock: z.number(),
});

export const deleteProductSchema = z.object({
  productId: z.string(),
});

export const editProductSchema = z.object({
  productId: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number(),
  quantityInStock: z.number(),
});

export const searchProductSchema = z.object({
  productId: z.string().optional(),
  search: z.string().optional(),
});
