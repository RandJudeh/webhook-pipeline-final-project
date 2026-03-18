import { Request, Response } from "express";
import { handleWebhookService } from "../services/webhookService.js";

export async function handleWebhook(req: Request, res: Response) {
  try {
    const sourceSlug = req.params.sourceSlug as string;
    const payload = req.body;

    const job = await handleWebhookService(sourceSlug, payload);

    if (!job) {
      return res.status(404).json({
        error: "Pipeline not found",
      });
    }

    return res.status(202).json({
      message: "Webhook accepted",
      job,
    });
  } catch (error) {
    console.error("Failed to handle webhook:", error);

    return res.status(500).json({
      error: "Failed to handle webhook",
    });
  }
}