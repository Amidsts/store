import { Router } from "express";

import signUp from "./controllers/signup";
import signIn from "./controllers/signIn";
import {
  verifyOtpSchema,
  signInSchema,
  signUpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validators";
import verifyOtp from "./controllers/verifyOtp";
import resendOtp from "./controllers/resendOtp";
import forgotPassword from "./controllers/forgotPassword";
import resetPassword from "./controllers/resetPassword";
import validateInput from "../../middlewares/inputValidator";

const router = Router();

router.post("/signup", validateInput(signUpSchema), signUp);
router.post("/verify-otp", validateInput(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validateInput(resendOtpSchema), resendOtp);
router.post("/signin", validateInput(signInSchema), signIn);

router.post(
  "/forgot-password",
  validateInput(forgotPasswordSchema),
  forgotPassword
);
router.patch(
  "/reset-password",
  validateInput(resetPasswordSchema),
  resetPassword
);


const authRouter = router;
export default authRouter;
