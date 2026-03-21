export type ActionType = "uppercase" | "reverse" | "word_count";

export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface CreatePipelineBody {
  name: string;
  webhookPath: string;
  actionType: ActionType;
}

export interface CreateSubscriberBody {
  pipelineId: string;
  targetUrl: string;
}

export interface WebhookPayload {
  message?: unknown;
}