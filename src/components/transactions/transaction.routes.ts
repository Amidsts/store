import { Router } from "express";
import txWebhookHandler from "./transactionController/txWebhook";
import validateInput from "../../middlewares/inputValidator";
import { initiatePaymentSchema } from "./transaction.validators";
import validateToken from "../../middlewares/tokenValidator";
import requireAuth from "../../middlewares/requireAuth";
import initiatePayment from "./transactionController/initiatePayment";
const router = Router();

router.post(
  "/payment",
  validateInput(initiatePaymentSchema),
  validateToken,
  requireAuth,
  initiatePayment
);
router.get("/webhook", txWebhookHandler);

const txRouter = router;
export default txRouter;
