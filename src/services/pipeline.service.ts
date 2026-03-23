import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { pipelines } from "../db/schema.js";

interface CreatePipelineInput {
  name: string;
  sourceSlug: string;
  actionType: string;
}

interface UpdatePipelineInput {
  name?: string;
  sourceSlug?: string;
  actionType?: string;
}

export async function createPipelineService(data: CreatePipelineInput) {
  const [pipeline] = await db
    .insert(pipelines)
    .values({
      name: data.name,
      sourceSlug: data.sourceSlug,
      actionType: data.actionType,
    })
    .returning();

  return pipeline;
}

export async function getAllPipelinesService() {
  return await db.select().from(pipelines);
}

export async function getPipelineByIdService(id: string) {
  const [pipeline] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id));

  return pipeline;
}

export async function getPipelineBySourceSlugService(sourceSlug: string) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourceSlug, sourceSlug))
    .limit(1);

  return result[0] ?? null;
}

export async function updatePipelineService(
  id: string,
  data: UpdatePipelineInput
) {
  const [updatedPipeline] = await db
    .update(pipelines)
    .set({
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.sourceSlug !== undefined ? { sourceSlug: data.sourceSlug } : {}),
      ...(data.actionType !== undefined ? { actionType: data.actionType } : {}),
      updatedAt: new Date(),
    })
    .where(eq(pipelines.id, id))
    .returning();

  return updatedPipeline;
}

export async function deletePipelineService(id: string) {
  const [deletedPipeline] = await db
    .delete(pipelines)
    .where(eq(pipelines.id, id))
    .returning();

  return deletedPipeline;
}