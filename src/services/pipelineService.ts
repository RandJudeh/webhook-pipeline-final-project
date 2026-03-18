import { db } from "../db/index.js";
import { pipelines, subscribers } from "../db/schema.js";

type CreatePipelineInput = {
  name: string;
  sourceSlug: string;
  actionType: string;
};

type AddSubscriberInput = {
  pipelineId: string;
  targetUrl: string;
};

export async function createPipelineService(input: CreatePipelineInput) {
  const [newPipeline] = await db
    .insert(pipelines)
    .values({
      name: input.name,
      sourceSlug: input.sourceSlug,
      actionType: input.actionType,
    })
    .returning();

  return newPipeline;
}

export async function getAllPipelinesService() {
  const allPipelines = await db.select().from(pipelines);
  return allPipelines;
}

export async function addSubscriberService(input: AddSubscriberInput) {
  const [newSubscriber] = await db
    .insert(subscribers)
    .values({
      pipelineId: input.pipelineId,
      targetUrl: input.targetUrl,
    })
    .returning();

  return newSubscriber;
}