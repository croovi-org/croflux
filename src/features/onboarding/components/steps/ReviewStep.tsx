import { useMemo, useState } from "react";

type StrategyMode = "paste" | "upload" | "notion";

interface ReviewStepProps {
  startupName: string;
  oneLiner: string;
  workspaceName: string;
  slug: string;
  strategyMode: StrategyMode;
  strategyText: string;
  strategyFile: File | null;
  notionUrl: string;
  activeStrategyText: string;
  activeStrategyWordCount: number;
}

function getModeLabel(mode: StrategyMode) {
  if (mode === "upload") return "Uploaded doc";
  if (mode === "notion") return "Notion";
  return "Pasted text";
}

function truncateStrategy(text: string, maxChars = 280, maxLines = 4): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";
  const lines = normalized.split("\n");
  const lineLimitedText =
    lines.length > maxLines ? lines.slice(0, maxLines).join("\n").trimEnd() : normalized;
  const lineTruncated = lines.length > maxLines;

  if (lineLimitedText.length <= maxChars) {
    return lineTruncated ? `${lineLimitedText}…` : lineLimitedText;
  }

  const hardCut = lineLimitedText.slice(0, maxChars);
  const lastWhitespace = hardCut.search(/\s+\S*$/);
  const safeCut = lastWhitespace > 0 ? hardCut.slice(0, lastWhitespace) : hardCut;
  const trimmed = safeCut.trimEnd();

  return `${trimmed}…`;
}

export function ReviewStep({
  startupName,
  oneLiner,
  workspaceName,
  slug,
  strategyMode,
  strategyText,
  strategyFile,
  notionUrl,
  activeStrategyText,
  activeStrategyWordCount,
}: ReviewStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fallbackStrategyPreview =
    strategyMode === "upload"
      ? strategyFile
        ? `File attached: ${strategyFile.name}`
        : "No file attached yet."
      : strategyMode === "notion"
        ? notionUrl || "No Notion URL added yet."
        : strategyText || "No strategy text added yet.";
  const rawStrategyText = activeStrategyText || fallbackStrategyPreview;
  const strategyPreview = useMemo(() => truncateStrategy(rawStrategyText), [rawStrategyText]);
  const isPreviewTruncated = strategyPreview !== rawStrategyText;
  const strategyWordCount = Math.max(0, activeStrategyWordCount || 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Step 04 / 04
        </div>
        <h1 className="mt-3 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.05em] text-[var(--text)]">
          Review before you commit.
        </h1>
        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[var(--text2)]">
          This final pass keeps onboarding low-friction while giving builders
          confidence that the roadmap engine is starting from the right inputs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg3)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
            Startup
          </div>
          <div className="mt-2 text-[16px] font-medium text-[var(--text)]">
            {startupName || "Untitled startup"}
          </div>
          <div className="mt-2 text-[14px] leading-7 text-[var(--text2)]">
            {oneLiner || "No one-line description yet."}
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg3)] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
            Workspace
          </div>
          <div className="mt-2 text-[16px] font-medium text-[var(--text)]">
            {workspaceName || "Workspace name pending"}
          </div>
          <div className="mt-2 font-mono text-[13px] text-[var(--purple2)]">
            croflux.app/{slug || "workspace-slug"}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg3)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
            Product Strategy
          </div>
          <div className="rounded-full border border-[var(--purple-border)] bg-[var(--purple-dim)] px-3 py-1 text-[11px] font-medium text-[var(--purple2)]">
            {getModeLabel(strategyMode)}
          </div>
        </div>
        <div className="mt-3 text-[13px] leading-6 text-[var(--text3)]">
          <div>Source: {getModeLabel(strategyMode)}</div>
          <div>Word count: {strategyWordCount} words</div>
        </div>
        <div
          className={`relative mt-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] p-4 font-mono text-[12px] leading-7 text-[var(--text2)] transition-[max-height] duration-300 ease-out ${
            isExpanded ? "max-h-[300px] overflow-y-auto" : "max-h-[120px] overflow-hidden"
          }`}
        >
          <div
            className={`whitespace-pre-wrap break-words ${isExpanded ? "" : "pr-1"}`}
            style={
              isExpanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                  }
            }
          >
            {isExpanded ? rawStrategyText : strategyPreview}
          </div>
          {!isExpanded && isPreviewTruncated ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg2)] via-[var(--bg2)]/85 to-transparent" />
          ) : null}
        </div>
        {isPreviewTruncated ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 text-[13px] font-medium text-[var(--purple2)] transition-colors hover:text-[var(--accent)]"
          >
            {isExpanded ? "Hide full strategy" : "View full strategy"}
          </button>
        ) : null}
      </div>

      <div className="rounded-[16px] border border-[var(--purple-border)] bg-[var(--purple-dim)] p-4 text-[14px] leading-7 text-[var(--text2)]">
        CroFlux will use this to generate milestones, tasks, and boss stages in
        the roadmap step. You can still edit everything before the build starts.
      </div>
    </div>
  );
}
