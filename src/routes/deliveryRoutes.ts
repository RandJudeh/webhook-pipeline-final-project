import { Router } from "express";
import { getAllDeliveryAttempts } from "../controllers/deliveryController.js";

const router = Router();

router.get("/", getAllDeliveryAttempts);

export default router;