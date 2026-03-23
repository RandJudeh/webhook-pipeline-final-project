import { db } from "../db/index.js";
import { deliveryAttempts, subscribers } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

type RecordDeliveryAttemptInput = {
  jobId: string;
  subscriberUrl: string;
  attemptNumber: number;
  status: string;
  responseStatusCode?: number | null;
  errorMessage?: string | null;
};

export async function getSubscribersForPipeline(pipelineId: string) {
  return await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipelineId));
}

export async function recordDeliveryAttempt(input: RecordDeliveryAttemptInput) {
  const result = await db
    .insert(deliveryAttempts)
    .values({
      jobId: input.jobId,
      subscriberUrl: input.subscriberUrl,
      attemptNumber: input.attemptNumber,
      status: input.status,
      responseStatusCode: input.responseStatusCode ?? null,
      errorMessage: input.errorMessage ?? null,
    })
    .returning();

  return result[0];
}

export async function countDeliveryAttemptsForJob(jobId: string): Promise<number> {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId));

  return Number(result[0]?.count ?? 0);
}

export async function getDeliveryAttemptsForJob(jobId: string) {
  return await db
    .select()
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId))
    .orderBy(desc(deliveryAttempts.attemptedAt));
}