import { Router } from "express";
import { receiveWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post("/:sourceSlug", receiveWebhook);

export default router;