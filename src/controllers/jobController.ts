import { Request, Response } from "express";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";

export async function getAllJobs(req: Request, res: Response) {
  try {
    const allJobs = await db.select().from(jobs);
    return res.status(200).json(allJobs);
  } catch (error) {
    console.error("Failed to get jobs:", error);
    return res.status(500).json({
      error: "Failed to get jobs",
    });
  }
}