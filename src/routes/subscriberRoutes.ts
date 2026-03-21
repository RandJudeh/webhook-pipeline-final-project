import { Router } from "express";
import {
  createSubscriber,
  getSubscribers,
} from "../controllers/subscriberController.js";

const router = Router();

router.get("/", getSubscribers);
router.post("/", createSubscriber);

export default router;