import { Request, Response } from "express";
import {
  getAllDeliveryAttemptsService,
  getDeliveryAttemptsForJob,
} from "../services/delivery.service.js";

export async function getDeliveryAttempts(
  req: Request,
  res: Response
): Promise<void> {
  const jobId = req.query.jobId as string;

  if (jobId) {
    const attempts = await getDeliveryAttemptsForJob(jobId);
    res.status(200).json(attempts);
    return;
  }

  const attempts = await getAllDeliveryAttemptsService();
  res.status(200).json(attempts);
}