import { Request, Response } from "express";
import { getJobByIdService } from "../services/job.service.js";
import {
  countDeliveryAttemptsForJob,
  getDeliveryAttemptsForJob,
} from "../services/delivery.service.js";
import {
  getAllJobsService,
} from "../services/job.service.js";
import {
  getJobsByPipelineIdService,
} from "../services/job.service.js";

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
  const job = await getJobByIdService(req.params.id as string);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  res.status(200).json(job);
}





export async function getJobByIdController(req: Request, res: Response) {
  try {
    const { jobId } = req.params;

    const job = await getJobByIdService(jobId as string);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const attempts = await getDeliveryAttemptsForJob(job.id);

    const attemptsCount = attempts.length;
    const successCount = attempts.filter(
      (attempt) => attempt.status === "SUCCESS"
    ).length;
    const failedCount = attempts.filter(
      (attempt) => attempt.status === "FAILED"
    ).length;

    return res.status(200).json({
      ...job,
      attemptsCount,
      successCount,
      failedCount,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}





export async function getJobsForPipelineController(
  req: Request,
  res: Response
) {
  try {
    const { pipelineId } = req.params;

    const jobs = await getJobsByPipelineIdService(pipelineId as string);

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const attempts = await getDeliveryAttemptsForJob(job.id);

        const attemptsCount = attempts.length;
        const successCount = attempts.filter(
          (attempt) => attempt.status === "SUCCESS"
        ).length;
        const failedCount = attempts.filter(
          (attempt) => attempt.status === "FAILED"
        ).length;

        return {
          ...job,
          attemptsCount,
          successCount,
          failedCount,
        };
      })
    );

    return res.status(200).json(jobsWithStats);
  } catch (error) {
    console.error("Error fetching jobs for pipeline:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}