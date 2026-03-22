import { Request, Response } from "express";
import {
  createSubscriberService,
  getAllSubscribersService,
  getSubscribersByPipelineService,
} from "../services/subscriber.service.js";

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export async function getSubscribers(
  req: Request,
  res: Response
): Promise<void> {
  const pipelineId = req.query.pipelineId as string;

  if (pipelineId) {
    const subscribers = await getSubscribersByPipelineService(pipelineId);
    res.status(200).json(subscribers);
    return;
  }

  const subscribers = await getAllSubscribersService();
  res.status(200).json(subscribers);
}

export async function createSubscriber(
  req: Request,
  res: Response
): Promise<void> {
  const { pipelineId, targetUrl } = req.body;

  if (!pipelineId || !targetUrl) {
    res.status(400).json({
      message: "pipelineId and targetUrl are required",
    });
    return;
  }

  if (typeof targetUrl !== "string" || !isValidUrl(targetUrl)) {
    res.status(400).json({
      message: "Invalid targetUrl",
    });
    return;
  }

  try {
    const subscriber = await createSubscriberService({
      pipelineId,
      targetUrl,
    });

    res.status(201).json(subscriber);
  } catch (error) {
    console.error("Error creating subscriber:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}