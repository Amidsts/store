import z from "zod";

export const initiatePaymentSchema = z.object({
  idempotencyKey: z.string().optional(),
  productId: z.string(),
  currency: z.enum(["NGN", "USD"]),
  quantity: z.number().default(1).optional(),
});
