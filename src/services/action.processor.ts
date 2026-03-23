export function processPayload(
  actionType: string,
  payload: { message?: unknown }
) {
  if (typeof payload.message !== "string") {
    throw new Error("Payload must contain a string message");
  }

  switch (actionType) {
    case "uppercase":
      return {
        message: payload.message.toUpperCase(),
      };

    case "reverse":
      return {
        message: payload.message.split("").reverse().join(""),
      };

    case "word_count":
      return {
        wordCount: payload.message.trim().split(/\s+/).length,
      };

    case "add_timestamp":
      return {
        message: payload.message,
        processedAt: new Date().toISOString(),
      };

    default:
      throw new Error(`Unsupported action type: ${actionType}`);
  }
}