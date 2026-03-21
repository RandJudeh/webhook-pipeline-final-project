import { Request, Response } from "express";
import {
  createSubscriberService,
  getAllSubscribersService,
  getSubscribersByPipelineService,
} from "../services/subscriberService.js";

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

  const subscriber = await createSubscriberService({
    pipelineId,
    targetUrl,
  });

  res.status(201).json(subscriber);
}