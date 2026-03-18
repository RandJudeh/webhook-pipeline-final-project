import { Router } from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post("/:sourceSlug", handleWebhook);

export default router;