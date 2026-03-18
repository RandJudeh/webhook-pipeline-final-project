import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { subscribers, deliveryAttempts } from "../db/schema.js";

export async function getSubscribersForPipeline(pipelineId: string) {
  return await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipelineId));
}

export async function recordDeliveryAttempt(
  jobId: string,
  subscriberUrl: string,
  status: string,
  responseStatusCode: number | null,
  errorMessage: string | null
) {
  await db.insert(deliveryAttempts).values({
    jobId,
    subscriberUrl,
    status,
    responseStatusCode,
    errorMessage,
  });
}