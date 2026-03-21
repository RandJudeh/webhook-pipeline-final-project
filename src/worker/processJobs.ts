// import {
//   getNextPendingJob,
//   getPipelineById,
//   markJobAsCompleted,
//   markJobAsFailed,
//   markJobAsProcessing,
// } from "../services/jobService.js";

// import {
//   getSubscribersForPipeline,
//   recordDeliveryAttempt,
// } from "../services/deliveryService.js";

// async function processOneJob() {
//   const job = await getNextPendingJob();

//   if (!job) {
//     console.log("No pending jobs found.");
//     return;
//   }

//   console.log(`Found job: ${job.id}`);

//   await markJobAsProcessing(job.id);

//   try {
//     const pipeline = await getPipelineById(job.pipelineId);

//     if (!pipeline) {
//       throw new Error("Pipeline not found for this job");
//     }

//     if (pipeline.actionType !== "uppercase") {
//       throw new Error(`Unsupported action type: ${pipeline.actionType}`);
//     }

//     const payload = job.payload as { message?: unknown };

//     if (typeof payload.message !== "string") {
//       throw new Error("Payload must contain a string message");
//     }

//     const processedPayload = {
//       ...payload,
//       message: payload.message.toUpperCase(),
//     };

//     await markJobAsCompleted(job.id, processedPayload);

//     const subscribers = await getSubscribersForPipeline(job.pipelineId);

//     for (const subscriber of subscribers) {
//       try {
//         const response = await fetch(subscriber.targetUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(processedPayload),
//         });

//         await recordDeliveryAttempt(
//           job.id,
//           subscriber.targetUrl,
//           "SUCCESS",
//           response.status,
//           null
//         );

//         console.log(`Delivered to ${subscriber.targetUrl}`);
//       } catch (error) {
//         const message =
//           error instanceof Error ? error.message : "Unknown delivery error";

//         await recordDeliveryAttempt(
//           job.id,
//           subscriber.targetUrl,
//           "FAILED",
//           null,
//           message
//         );

//         console.error(`Delivery failed for ${subscriber.targetUrl}`);
//       }
//     }

//     console.log(`Job ${job.id} completed successfully.`);
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Unknown processing error";

//     await markJobAsFailed(job.id, message);

//     console.error(`Job ${job.id} failed:`, message);
//   }
// }

// processOneJob()
//   .then(() => {
//     console.log("Worker finished.");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Worker crashed:", error);
//     process.exit(1);
//   });