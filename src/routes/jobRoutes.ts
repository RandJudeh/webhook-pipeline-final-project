import { Router } from "express";
import { getJobById, getJobs } from "../controllers/jobController.js";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;