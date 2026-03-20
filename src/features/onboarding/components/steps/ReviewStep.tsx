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
}

function getModeLabel(mode: StrategyMode) {
  if (mode === "upload") return "Uploaded file";
  if (mode === "notion") return "Notion link";
  return "Pasted text";
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
}: ReviewStepProps) {
  const strategyPreview =
    strategyMode === "upload"
      ? strategyFile
        ? `File attached: ${strategyFile.name}`
        : "No file attached yet."
      : strategyMode === "notion"
        ? notionUrl || "No Notion URL added yet."
        : strategyText || "No strategy text added yet.";

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
            Product strategy
          </div>
          <div className="rounded-full border border-[var(--purple-border)] bg-[var(--purple-dim)] px-3 py-1 text-[11px] font-medium text-[var(--purple2)]">
            {getModeLabel(strategyMode)}
          </div>
        </div>
        <div className="mt-4 whitespace-pre-wrap rounded-[12px] border border-[var(--border)] bg-[var(--bg2)] p-4 font-mono text-[12px] leading-7 text-[var(--text2)]">
          {strategyPreview}
        </div>
      </div>

      <div className="rounded-[16px] border border-[var(--purple-border)] bg-[var(--purple-dim)] p-4 text-[14px] leading-7 text-[var(--text2)]">
        CroFlux will use this to generate milestones, tasks, and boss stages in
        the roadmap step. You can still edit everything before the build starts.
      </div>
    </div>
  );
}
