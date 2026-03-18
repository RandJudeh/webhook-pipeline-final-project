import { Router } from "express";
import {
  createPipeline,
  getAllPipelines,
  addSubscriber,
} from "../controllers/pipelineController.js";

const router = Router();

router.post("/", createPipeline);
router.get("/", getAllPipelines);
router.post("/:pipelineId/subscribers", addSubscriber);

export default router;