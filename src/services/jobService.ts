import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { jobs, pipelines } from "../db/schema.js";

export async function getNextPendingJob() {
  const pendingJobs = await db.select().from(jobs).where(eq(jobs.status, "PENDING")).limit(1);

  return pendingJobs[0] ?? null;
}

export async function markJobAsProcessing(jobId: string) {
  const [updatedJob] = await db
    .update(jobs)
    .set({
      status: "PROCESSING",
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, jobId))
    .returning();

  return updatedJob;
}

export async function markJobAsCompleted(jobId: string, processedPayload: unknown) {
  const [updatedJob] = await db
    .update(jobs)
    .set({
      status: "COMPLETED",
      processedPayload,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, jobId))
    .returning();

  return updatedJob;
}

export async function markJobAsFailed(jobId: string, errorMessage: string) {
  const [updatedJob] = await db
    .update(jobs)
    .set({
      status: "FAILED",
      errorMessage,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, jobId))
    .returning();

  return updatedJob;
}

export async function getPipelineById(pipelineId: string) {
  const result = await db.select().from(pipelines).where(eq(pipelines.id, pipelineId)).limit(1);
  return result[0] ?? null;
}