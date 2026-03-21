import { WORKER_INTERVAL } from "../config/env.js";
import {
  getNextPendingJobService,
  markJobAsCompletedService,
  markJobAsFailedService,
  markJobAsProcessingService,
} from "../services/jobService.js";
import { getPipelineByIdService } from "../services/pipelineService.js";
import { processPayload } from "../services/processorService.js";

async function processOneJob(): Promise<void> {
  const pendingJob = await getNextPendingJobService();

  if (!pendingJob) {
    console.log("No pending jobs found.");
    return;
  }

  console.log(`Found pending job: ${pendingJob.id}`);

  await markJobAsProcessingService(pendingJob.id);

  try {
    const pipeline = await getPipelineByIdService(pendingJob.pipelineId);

    if (!pipeline) {
      throw new Error("Pipeline not found for this job");
    }

    const processedPayload = processPayload({
      actionType: pipeline.actionType,
      payload: pendingJob.payload as Record<string, unknown>,
    });

    await markJobAsCompletedService(pendingJob.id, processedPayload);

    console.log(`Job ${pendingJob.id} completed successfully.`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown processing error";

    await markJobAsFailedService(pendingJob.id, message);

    console.error(`Job ${pendingJob.id} failed: ${message}`);
  }
}

async function startWorker(): Promise<void> {
  console.log(`Worker started. Polling every ${WORKER_INTERVAL} ms...`);

  await processOneJob();

  setInterval(async () => {
    await processOneJob();
  }, WORKER_INTERVAL);
}

startWorker().catch((error) => {
  console.error("Worker crashed on startup:", error);
  process.exit(1);
});