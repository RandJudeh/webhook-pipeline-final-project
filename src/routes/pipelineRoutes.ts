import { Router } from "express";
import {
  createPipeline,
  deletePipeline,
  getPipelineById,
  getPipelines,
  updatePipeline,
} from "../controllers/pipelineController.js";

const router = Router();

router.get("/", getPipelines);
router.get("/:id", getPipelineById);
router.post("/", createPipeline);
router.put("/:id", updatePipeline);
router.delete("/:id", deletePipeline);

export default router;