import z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNo: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
    email: z.string().email(),
    code: z.string().refine((value) => value.length === 6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

  export const resendOtpSchema = z.object({
    email: z.string().email(),
    otpPurpose: z.string()
  });

  export const verifyOtpSchema = z.object({
    code: z.string().refine((value) => value.length === 4),
    email: z.string().email(),
    otpPurpose: z.string()
  });