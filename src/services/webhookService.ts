import { db } from "../db/index.js";
import { pipelines, jobs } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function handleWebhookService(
  sourceSlug: string,
  payload: any
) {
  const [pipeline] = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourceSlug, sourceSlug));

  if (!pipeline) {
    return null;
  }

  const [job] = await db
    .insert(jobs)
    .values({
      pipelineId: pipeline.id,
      payload,
      status: "PENDING",
    })
    .returning();

  return job;
}