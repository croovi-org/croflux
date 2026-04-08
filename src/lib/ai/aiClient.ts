import "server-only";

const AI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_ATTEMPTS = 2;

export type AIRoadmapResponse = {
  project_summary: string;
  milestones: Array<{
    title: string;
    description: string;
    is_boss: boolean;
    tasks: Array<{
      title: string;
      description: string;
      estimated_hours: number;
    }>;
  }>;
};

type GenerateRoadmapParams = {
  systemPrompt: string;
  userPrompt: string;
};

type GeminiResponse = {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
};

function parseJSONSafely(text: string): AIRoadmapResponse {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace < 0 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in response.");
  }

  const jsonCandidate = text.slice(firstBrace, lastBrace + 1);
  const parsed: unknown = JSON.parse(jsonCandidate);

  if (!isAIRoadmapResponse(parsed)) {
    throw new Error("Parsed JSON does not match expected roadmap schema.");
  }

  return parsed;
}

class AIHttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AIHttpError";
    this.status = status;
  }
}

async function attemptRequest(
  params: GenerateRoadmapParams,
  modelName: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const prompt = [
      "System Instructions:",
      params.systemPrompt,
      "",
      "User Request:",
      params.userPrompt,
    ].join("\n");

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(
      `${AI_ENDPOINT}/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      const detail = errorBody ? ` - ${errorBody}` : "";
      throw new AIHttpError(
        `Gemini API request failed (${response.status})${detail}`,
        response.status,
      );
    }

    const payloadJson = (await response.json()) as GeminiResponse;
    const content = payloadJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content || !content.trim()) {
      throw new Error("Gemini API returned an empty response.");
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Gemini API request timed out after 25 seconds");
    }

    throw error instanceof Error
      ? error
      : new Error("Unexpected error while calling Gemini API.");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateRoadmapFromAI(
  params: GenerateRoadmapParams,
): Promise<AIRoadmapResponse> {
  const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ] as const;

  for (const modelName of MODELS) {
    console.log("Trying model:", modelName);
    let lastParseError: Error | null = null;
    let shouldTryNextModel = false;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      let rawText: string;

      try {
        rawText = await attemptRequest(params, modelName);
      } catch (error) {
        if (
          error instanceof AIHttpError &&
          (error.status === 429 || error.status === 503)
        ) {
          shouldTryNextModel = true;
          if (attempt === MAX_ATTEMPTS) {
            break;
          }
          continue;
        }
        throw error instanceof Error
          ? error
          : new Error("Unexpected error while calling Gemini API.");
      }

      try {
        const parsed = parseJSONSafely(rawText);
        console.log("Success with model:", modelName);
        return parsed;
      } catch (error) {
        if (error instanceof Error) {
          lastParseError = error;
        } else {
          lastParseError = new Error("Failed to parse AI response as JSON.");
        }

        if (attempt === MAX_ATTEMPTS) {
          break;
        }
      }
    }

    if (shouldTryNextModel) {
      continue;
    }

    if (lastParseError) {
      const reason = lastParseError.message
        ? `: ${lastParseError.message}`
        : "";
      throw new Error(
        `Invalid JSON response from AI after 2 attempts${reason}`,
      );
    }
  }

  throw new Error("All AI models unavailable. Please try again shortly.");
}

function isAIRoadmapResponse(value: unknown): value is AIRoadmapResponse {
  if (!isRecord(value)) return false;
  if (typeof value.project_summary !== "string") return false;
  if (!Array.isArray(value.milestones)) return false;

  return value.milestones.every((milestone) => {
    if (!isRecord(milestone)) return false;
    if (typeof milestone.title !== "string") return false;
    if (typeof milestone.description !== "string") return false;
    if (
      "is_boss" in milestone &&
      typeof milestone.is_boss !== "boolean"
    ) {
      return false;
    }
    if (!Array.isArray(milestone.tasks)) return false;

    return milestone.tasks.every((task) => {
      if (!isRecord(task)) return false;
      return (
        typeof task.title === "string" &&
        typeof task.description === "string" &&
        (typeof task.estimated_hours === "number" ||
          typeof task.estimated_hours === "string")
      );
    });
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
