import { Router } from "express";
import txWebhookHandler from "./transactionController/txWebhook";
const router = Router();

router.post("/webhook", txWebhookHandler);

const txRouter = router;
export default txRouter;
