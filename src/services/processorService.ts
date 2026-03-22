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
        transformedText: message.toUpperCase(),
      };

    case "reverse":
      return {
        transformedText: message.split("").reverse().join(""),
      };

    case "word_count":
      return {
        wordCount: message.trim().split(/\s+/).filter(Boolean).length,
      };

    case "extract_emails": {
      const emails = message.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
      return {
        emails,
        count: emails.length,
      };
    }

    case "text_stats": {
      const words = message.trim().split(/\s+/).filter(Boolean);
      const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);

      return {
        characterCount: message.length,
        wordCount: words.length,
        sentenceCount: sentences.length,
        averageWordLength: words.length === 0 ? 0 : Number((totalWordLength / words.length).toFixed(2)),
      };
    }

    case "slugify": {
      const slug = message
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      return {
        slug,
      };
    }

    case "mask_sensitive_data": {
      const maskedText = message
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]")
        .replace(/\b\d{9,15}\b/g, "[PHONE]");

      return {
        maskedText,
      };
    }

    case "keyword_frequency": {
      const words = message
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

      const frequencyMap: Record<string, number> = {};

      for (const word of words) {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      }

      const topKeywords = Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word, count]) => ({ word, count }));

      return {
        topKeywords,
      };
    }

    default:
      throw new Error(`Unsupported action type: ${actionType}`);
  }
}