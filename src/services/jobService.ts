import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";

interface CreateJobInput {
  pipelineId: string;
  payload: Record<string, unknown>;
}

export async function createJobService(data: CreateJobInput) {
  const [job] = await db
    .insert(jobs)
    .values({
      pipelineId: data.pipelineId,
      payload: data.payload,
      status: "PENDING",
    })
    .returning();

  return job;
}

export async function getAllJobsService() {
  return await db.select().from(jobs);
}

export async function getJobByIdService(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  return job;
}

export async function getNextPendingJobService() {
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.status, "PENDING"), isNull(jobs.startedAt)))
    .orderBy(asc(jobs.receivedAt))
    .limit(1);

  return job;
}

export async function markJobAsProcessingService(id: string) {
  const [job] = await db
    .update(jobs)
    .set({
      status: "PROCESSING",
      startedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return job;
}

export async function markJobAsCompletedService(
  id: string,
  processedPayload: Record<string, unknown>
) {
  const [job] = await db
    .update(jobs)
    .set({
      status: "COMPLETED",
      processedPayload,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return job;
}

export async function markJobAsFailedService(id: string, errorMessage: string) {
  const [job] = await db
    .update(jobs)
    .set({
      status: "FAILED",
      errorMessage,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return job;
}