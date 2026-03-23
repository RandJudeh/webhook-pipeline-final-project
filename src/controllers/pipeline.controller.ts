import { Request, Response } from "express";
import {
  createPipelineService,
  deletePipelineService,
  getAllPipelinesService,
  getPipelineByIdService,
  updatePipelineService,
  getPipelineBySourceSlugService,
} from "../services/pipeline.service.js";

const ALLOWED_ACTION_TYPES = [
  "uppercase",
  "reverse",
  "add_timestamp",
  "word_count"
];

export async function getPipelines(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const allPipelines = await getAllPipelinesService();
    res.status(200).json(allPipelines);
  } catch (error) {
    console.error("Get pipelines error:", error);
    res.status(500).json({ message: "Failed to fetch pipelines" });
  }
}

export async function getPipelineById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pipeline = await getPipelineByIdService(req.params.id as string);

    if (!pipeline) {
      res.status(404).json({ message: "Pipeline not found" });
      return;
    }

    res.status(200).json(pipeline);
  } catch (error) {
    console.error("Get pipeline by id error:", error);
    res.status(500).json({ message: "Failed to fetch pipeline" });
  }
}

export async function createPipeline(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, sourceSlug, actionType } = req.body;

    if (!name || !sourceSlug || !actionType) {
      res.status(400).json({
        message: "name, sourceSlug, and actionType are required",
      });
      return;
    }

    if (!ALLOWED_ACTION_TYPES.includes(actionType)) {
      res.status(400).json({
        message: `Invalid actionType. Allowed values are: ${ALLOWED_ACTION_TYPES.join(
          ", "
        )}`,
      });
      return;
    }

    const existing = await getPipelineBySourceSlugService(sourceSlug);

    if (existing) {
      res.status(409).json({
        message: "sourceSlug already exists",
      });
      return;
    }

    const pipeline = await createPipelineService({
      name,
      sourceSlug,
      actionType,
    });

    res.status(201).json(pipeline);
  } catch (error: any) {
    console.error("Create pipeline error:", error);

    if (error?.code === "23505") {
      res.status(409).json({
        message: "sourceSlug already exists",
      });
      return;
    }

    res.status(500).json({
      message: "Failed to create pipeline",
    });
  }
}

export async function updatePipeline(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, sourceSlug, actionType } = req.body;
    const pipelineId = req.params.id as string;

    const existingPipeline = await getPipelineByIdService(pipelineId);

    if (!existingPipeline) {
      res.status(404).json({ message: "Pipeline not found" });
      return;
    }

    if (actionType && !ALLOWED_ACTION_TYPES.includes(actionType)) {
      res.status(400).json({
        message: `Invalid actionType. Allowed values are: ${ALLOWED_ACTION_TYPES.join(
          ", "
        )}`,
      });
      return;
    }

    if (sourceSlug && sourceSlug !== existingPipeline.sourceSlug) {
      const existingSlug = await getPipelineBySourceSlugService(sourceSlug);

      if (existingSlug) {
        res.status(409).json({
          message: "sourceSlug already exists",
        });
        return;
      }
    }

    const updatedPipeline = await updatePipelineService(pipelineId, {
      name,
      sourceSlug,
      actionType,
    });

    res.status(200).json(updatedPipeline);
  } catch (error: any) {
    console.error("Update pipeline error:", error);

    if (error?.code === "23505") {
      res.status(409).json({
        message: "sourceSlug already exists",
      });
      return;
    }

    res.status(500).json({
      message: "Failed to update pipeline",
    });
  }
}

export async function deletePipeline(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deletedPipeline = await deletePipelineService(req.params.id as string);

    if (!deletedPipeline) {
      res.status(404).json({ message: "Pipeline not found" });
      return;
    }

    res.status(200).json({
      message: "Pipeline deleted successfully",
      pipeline: deletedPipeline,
    });
  } catch (error) {
    console.error("Delete pipeline error:", error);
    res.status(500).json({ message: "Failed to delete pipeline" });
  }
}