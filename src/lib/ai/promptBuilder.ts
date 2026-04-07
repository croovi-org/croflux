const MAX_STRATEGY_WORDS = 4000;

type BuildRoadmapPromptParams = {
  productStrategy: string;
  productStage?: string;
};

type RoadmapPrompt = {
  system: string;
  user: string;
};

export function buildRoadmapPrompt(
  params: BuildRoadmapPromptParams,
): RoadmapPrompt {
  const cleanedProductStrategy = sanitizeAndLimitStrategy(params.productStrategy);
  const normalizedStage = normalizeLine(params.productStage ?? "") || "MVP";

  const systemMessage = [
    "You are an expert startup execution planner.",
    "",
    "Your job is to convert a Product Development Strategy (PDS) into a structured execution roadmap.",
    "",
    "The roadmap must be practical, logically ordered, and focused on shipping a real MVP.",
    "",
    "Focus on clarity and execution.",
    "",
    "Avoid vague advice.",
    "",
    "Avoid generic business language.",
    "",
    "Return ONLY valid JSON.",
    "",
    "Do not include markdown.",
    "",
    "Do not include explanations.",
    "",
    "Do not include commentary.",
    "",
    "Do not include code blocks.",
    "",
    "JSON structure must match the schema exactly.",
  ].join("\n");

  const userMessage = [
    "Product Context:",
    cleanedProductStrategy,
    "",
    "Product Stage:",
    normalizedStage,
    "",
    "Constraints:",
    "",
    "* create 3 to 6 milestones",
    "* each milestone must contain 4 to 7 tasks",
    "* tasks must be actionable",
    "* tasks must be specific enough to execute immediately",
    "* tasks must follow logical development order",
    "* include exactly 1 boss milestone",
    "* boss milestone should represent major progress checkpoint",
    '* avoid vague tasks like:',
    '  "improve UX"',
    '  "do marketing"',
    '  "grow product"',
    "* avoid repeating similar tasks",
    "* tasks should represent real implementation work",
    "",
    "Execution assumptions:",
    "",
    "* builder is technical or semi-technical",
    "* builder wants fast MVP",
    "* builder works solo or small team",
    "* prioritize shipping over perfection",
    "",
    "Output JSON schema:",
    "",
    "{",
    '"project_summary": "string",',
    '"milestones": [',
    "{",
    '"title": "string",',
    '"description": "string",',
    '"is_boss": boolean,',
    '"tasks": [',
    "{",
    '"title": "string",',
    '"description": "string",',
    '"estimated_hours": number',
    "}",
    "]",
    "}",
    "]",
    "}",
    "",
    "Rules:",
    "",
    "estimated_hours must be between 1 and 12",
    "",
    "Milestones must be in execution order.",
  ].join("\n");

  return {
    system: systemMessage,
    user: userMessage,
  };
}

function sanitizeAndLimitStrategy(input: string): string {
  const base = normalizeText(input);
  if (!base) {
    return "No product strategy provided.";
  }

  const words = base.split(/\s+/).filter(Boolean);
  if (words.length <= MAX_STRATEGY_WORDS) {
    return base;
  }

  return words.slice(0, MAX_STRATEGY_WORDS).join(" ");
}

function normalizeText(value: string): string {
  const normalizedNewlines = value.replace(/\r\n?/g, "\n");
  const safeChars = normalizedNewlines.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    " ",
  );
  const collapsedLineSpacing = safeChars.replace(/\n{2,}/g, "\n");
  const normalizedLines = collapsedLineSpacing
    .split("\n")
    .map((line) => normalizeLine(line))
    .join("\n");

  return normalizedLines.trim();
}

function normalizeLine(line: string): string {
  return line.replace(/[ \t]+/g, " ").trim();
}
