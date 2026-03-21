import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { subscribers } from "../db/schema.js";

interface CreateSubscriberInput {
  pipelineId: string;
  targetUrl: string;
}

export async function createSubscriberService(data: CreateSubscriberInput) {
  const [subscriber] = await db
    .insert(subscribers)
    .values({
      pipelineId: data.pipelineId,
      targetUrl: data.targetUrl,
    })
    .returning();

  return subscriber;
}

export async function getSubscribersByPipelineService(pipelineId: string) {
  return await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipelineId));
}

export async function getAllSubscribersService() {
  return await db.select().from(subscribers);
}