import { Request, Response } from "express";
import { getPipelineBySourceSlugService } from "../services/pipelineService.js";
import { createJobService } from "../services/jobService.js";

export async function receiveWebhook(
  req: Request,
  res: Response
): Promise<void> {
  const { sourceSlug } = req.params;

  const pipeline = await getPipelineBySourceSlugService(sourceSlug as string);

  if (!pipeline) {
    res.status(404).json({ message: "Pipeline not found" });
    return;
  }

  const payload = req.body as Record<string, unknown>;

  const job = await createJobService({
    pipelineId: pipeline.id,
    payload,
  });

  res.status(202).json({
    message: "Webhook accepted",
    pipeline,
    job,
  });
}