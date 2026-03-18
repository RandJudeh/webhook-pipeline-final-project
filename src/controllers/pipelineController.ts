import { Request, Response } from "express";
import {
  createPipelineService,
  getAllPipelinesService,
  addSubscriberService,
} from "../services/pipelineService.js";

export async function createPipeline(req: Request, res: Response) {
  try {
    const { name, sourceSlug, actionType } = req.body;

    if (!name || !sourceSlug || !actionType) {
      return res.status(400).json({
        error: "name, sourceSlug, and actionType are required",
      });
    }

    const newPipeline = await createPipelineService({
      name,
      sourceSlug,
      actionType,
    });

    return res.status(201).json(newPipeline);
  } catch (error: any) {
    console.error("Failed to create pipeline:", error);

    if (error?.cause?.code === "23505") {
      return res.status(409).json({
        error: "A pipeline with this sourceSlug already exists",
      });
    }

    return res.status(500).json({
      error: "Failed to create pipeline",
    });
  }
}

export async function getAllPipelines(req: Request, res: Response) {
  try {
    const allPipelines = await getAllPipelinesService();
    return res.status(200).json(allPipelines);
  } catch (error) {
    console.error("Failed to get pipelines:", error);
    return res.status(500).json({
      error: "Failed to get pipelines",
    });
  }
}

export async function addSubscriber(req: Request, res: Response) {
  try {
    const pipelineId = req.params.pipelineId as string;
    const { targetUrl } = req.body;

    if (!pipelineId || !targetUrl) {
      return res.status(400).json({
        error: "pipelineId and targetUrl are required",
      });
    }

    const newSubscriber = await addSubscriberService({
      pipelineId,
      targetUrl,
    });

    return res.status(201).json(newSubscriber);
  } catch (error: any) {
    console.error("Failed to add subscriber:", error);

    if (error?.cause?.code === "23503") {
      return res.status(404).json({
        error: "Pipeline not found",
      });
    }

    return res.status(500).json({
      error: "Failed to add subscriber",
    });
  }
}