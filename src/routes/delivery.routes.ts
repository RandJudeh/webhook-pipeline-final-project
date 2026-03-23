import { Router } from "express";
import { getDeliveryAttempts } from "../controllers/delivery.controller.js";

const router = Router();

router.get("/delivery-attempts", getDeliveryAttempts);

export default router;