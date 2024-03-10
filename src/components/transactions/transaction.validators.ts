import z from "zod";

export const initiateOrderSchema = z.object({
  idempotencyKey: z.string().optional(),
  productId: z.string(),
  currency: z.string(),
  quantity: z.number().default(1),
});
