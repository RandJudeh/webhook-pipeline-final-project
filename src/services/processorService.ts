interface ProcessPayloadInput {
  actionType: string;
  payload: Record<string, unknown>;
}

export function processPayload({
  actionType,
  payload,
}: ProcessPayloadInput): Record<string, unknown> {
  const message = payload.message;

  if (typeof message !== "string") {
    throw new Error("Payload must contain a string 'message'");
  }

  switch (actionType) {
    case "uppercase":
      return {
        originalMessage: message,
        result: message.toUpperCase(),
      };

    case "reverse":
      return {
        originalMessage: message,
        result: message.split("").reverse().join(""),
      };

    case "word_count":
      return {
        originalMessage: message,
        result: message.trim() === "" ? 0 : message.trim().split(/\s+/).length,
      };

    default:
      throw new Error(`Unsupported action type: ${actionType}`);
  }
}