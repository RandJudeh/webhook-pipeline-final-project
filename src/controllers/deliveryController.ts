import { Request, Response } from "express";
import { db } from "../db/index.js";
import { deliveryAttempts } from "../db/schema.js";

export async function getAllDeliveryAttempts(req: Request, res: Response) {
  try {
    const attempts = await db.select().from(deliveryAttempts);
    return res.status(200).json(attempts);
  } catch (error) {
    console.error("Failed to get delivery attempts:", error);

    return res.status(500).json({
      error: "Failed to get delivery attempts",
    });
  }
}