import { Router } from "express";
import { getJobByIdController,getJobById,getJobsForPipelineController,getJobs } from "../controllers/jobController.js";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.get("/:jobId", getJobByIdController);
router.get("/pipelines/:pipelineId/jobs", getJobsForPipelineController);
export default router;