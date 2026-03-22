import { Router } from "express";
import {
  createSubscriber,
  getSubscribers,
} from "../controllers/subscriber.controller.js";

const router = Router();

router.get("/", getSubscribers);
router.post("/", createSubscriber);

export default router;