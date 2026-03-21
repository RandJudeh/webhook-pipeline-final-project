import { Request, Response } from "express";
import {
  getAllJobsService,
  getJobByIdService,
} from "../services/jobService.js";

export async function getJobs(
  _req: Request,
  res: Response
): Promise<void> {
  const jobs = await getAllJobsService();
  res.status(200).json(jobs);
}

export async function getJobById(
  req: Request,
  res: Response
): Promise<void> {
  const job = await getJobByIdService(req.params.id);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  res.status(200).json(job);
}