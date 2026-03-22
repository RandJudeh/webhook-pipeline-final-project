import { WORKER_INTERVAL } from "../config/env.js";
import {
  getNextPendingJobService,
  markJobAsCompletedService,
  markJobAsFailedService,
  markJobAsProcessingService,
} from "../services/jobService.js";
import { getPipelineByIdService } from "../services/pipelineService.js";
import { processPayload } from "../services/processorService.js";
import {
  getSubscribersForPipeline,
  recordDeliveryAttempt,
} from "../services/deliveryService.js";

const MAX_DELIVERY_RETRIES = 3;

let hasLoggedNoPendingJobs = false;

async function processOneJob(): Promise<void> {
  const pendingJob = await getNextPendingJobService();

  if (!pendingJob) {
    if (!hasLoggedNoPendingJobs) {
      console.log("No pending jobs found.");
      hasLoggedNoPendingJobs = true;
    }
    return;
  }

  hasLoggedNoPendingJobs = false;

  console.log(`Found pending job: ${pendingJob.id}`);

  await markJobAsProcessingService(pendingJob.id);

  try {
    const pipeline = await getPipelineByIdService(pendingJob.pipelineId);

    if (!pipeline) {
      throw new Error("Pipeline not found for this job");
    }

    if (!pendingJob.payload || typeof pendingJob.payload !== "object") {
      throw new Error("Invalid payload format");
    }

    const processedPayload = processPayload({
      actionType: pipeline.actionType,
      payload: pendingJob.payload as Record<string, unknown>,
    });

    const subscribers = await getSubscribersForPipeline(pipeline.id);

    for (const subscriber of subscribers) {
      let delivered = false;

      for (let attempt = 1; attempt <= MAX_DELIVERY_RETRIES; attempt++) {
        try {
          console.log(
            `Sending to subscriber URL: ${subscriber.targetUrl} (attempt ${attempt}/${MAX_DELIVERY_RETRIES})`
          );

          const response = await fetch(subscriber.targetUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobId: pendingJob.id,
              pipelineId: pipeline.id,
              originalPayload: pendingJob.payload,
              processedPayload,
            }),
          });

          if (response.ok) {
            console.log(
              `Delivered job ${pendingJob.id} to ${subscriber.targetUrl} on attempt ${attempt}`
            );

            await recordDeliveryAttempt({
              jobId: pendingJob.id,
              subscriberUrl: subscriber.targetUrl,
              status: "SUCCESS",
              responseStatusCode: response.status,
              errorMessage: null,
            });

            delivered = true;
            break;
          }

          console.log(
            `Delivery failed for ${subscriber.targetUrl} with status ${response.status} on attempt ${attempt}`
          );

          await recordDeliveryAttempt({
            jobId: pendingJob.id,
            subscriberUrl: subscriber.targetUrl,
            status: "FAILED",
            responseStatusCode: response.status,
            errorMessage: `HTTP ${response.status}`,
          });
        } catch (error) {
          console.error(
            `Failed to deliver job ${pendingJob.id} to ${subscriber.targetUrl} on attempt ${attempt}:`,
            error
          );

          await recordDeliveryAttempt({
            jobId: pendingJob.id,
            subscriberUrl: subscriber.targetUrl,
            status: "FAILED",
            responseStatusCode: null,
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      if (!delivered) {
        console.log(
          `Subscriber ${subscriber.targetUrl} failed after ${MAX_DELIVERY_RETRIES} attempts.`
        );
      }
    }

    await markJobAsCompletedService(pendingJob.id, processedPayload);
    console.log(`Job ${pendingJob.id} completed successfully.`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown worker error";

    console.error(`Job ${pendingJob.id} failed:`, errorMessage);

    await markJobAsFailedService(pendingJob.id, errorMessage);
  }
}

export function startWorker(): void {
  console.log(`Worker started. Polling every ${WORKER_INTERVAL} ms`);

  setInterval(async () => {
    try {
      await processOneJob();
    } catch (error) {
      console.error("Worker loop error:", error);
    }
  }, WORKER_INTERVAL);
}

startWorker();