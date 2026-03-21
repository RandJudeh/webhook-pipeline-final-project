import { Request, Response } from "express";
import {
  createPipelineService,
  deletePipelineService,
  getAllPipelinesService,
  getPipelineByIdService,
  updatePipelineService,
} from "../services/pipelineService.js";

export async function getPipelines(
  _req: Request,
  res: Response
): Promise<void> {
  const allPipelines = await getAllPipelinesService();
  res.status(200).json(allPipelines);
}

export async function getPipelineById(
  req: Request,
  res: Response
): Promise<void> {
  const pipeline = await getPipelineByIdService(req.params.id as string);

  if (!pipeline) {
    res.status(404).json({ message: "Pipeline not found" });
    return;
  }

  res.status(200).json(pipeline);
}

export async function createPipeline(
  req: Request,
  res: Response
): Promise<void> {
  const { name, sourceSlug, actionType } = req.body;

  if (!name || !sourceSlug || !actionType) {
    res.status(400).json({
      message: "name, sourceSlug, and actionType are required",
    });
    return;
  }

  const pipeline = await createPipelineService({
    name,
    sourceSlug,
    actionType,
  });

  res.status(201).json(pipeline);
}

export async function updatePipeline(
  req: Request,
  res: Response
): Promise<void> {
  const { name, sourceSlug, actionType } = req.body;

  const updatedPipeline = await updatePipelineService(req.params.id as string, {
    name,
    sourceSlug,
    actionType,
  });

  if (!updatedPipeline) {
    res.status(404).json({ message: "Pipeline not found" });
    return;
  }

  res.status(200).json(updatedPipeline);
}

export async function deletePipeline(
  req: Request,
  res: Response
): Promise<void> {
  const deletedPipeline = await deletePipelineService(req.params.id as string);

  if (!deletedPipeline) {
    res.status(404).json({ message: "Pipeline not found" });
    return;
  }

  res.status(200).json({
    message: "Pipeline deleted successfully",
    pipeline: deletedPipeline,
  });
}