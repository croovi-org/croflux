import { RefObject } from "react";

type StrategyMode = "paste" | "upload" | "notion";

interface StrategyStepProps {
  strategyMode: StrategyMode;
  strategyText: string;
  notionUrl: string;
  strategyFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onModeChange: (mode: StrategyMode) => void;
  onTextChange: (value: string) => void;
  onNotionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}

const modeLabels: Array<{ id: StrategyMode; label: string }> = [
  { id: "paste", label: "Paste text" },
  { id: "upload", label: "Upload file" },
  { id: "notion", label: "Notion link" },
];

export function StrategyStep({
  strategyMode,
  strategyText,
  notionUrl,
  strategyFile,
  fileInputRef,
  onModeChange,
  onTextChange,
  onNotionChange,
  onFileChange,
}: StrategyStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--purple2)]">
          Step 03 / 04
        </div>
        <h1 className="mt-3 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.05em] text-[var(--text)]">
          Add your product strategy.
        </h1>
        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[var(--text2)]">
          Paste your Product Development Strategy, upload a document, or drop a
          Notion link. Pick whichever input method is fastest for you.
        </p>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg2)]">
        <div className="flex flex-wrap border-b border-[var(--border)] bg-[var(--bg3)]">
          {modeLabels.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              className={`border-r border-[var(--border)] px-4 py-3 text-[12px] font-medium transition last:border-r-0 ${
                strategyMode === mode.id
                  ? "bg-[var(--bg2)] text-[var(--text)]"
                  : "text-[var(--text3)] hover:text-[var(--text)]"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {strategyMode === "paste" ? (
            <textarea
              value={strategyText}
              onChange={(event) => onTextChange(event.target.value)}
              placeholder="Paste your Product Development Strategy here. Example: build the MVP, validate onboarding, add Stripe, launch publicly, and measure retention..."
              className="min-h-[260px] w-full rounded-[14px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-4 font-mono text-[13px] leading-7 text-[var(--text2)] outline-none transition placeholder:text-[var(--text4)] focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
            />
          ) : null}

          {strategyMode === "upload" ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.md,.txt"
                className="hidden"
                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--border3)] bg-[var(--bg3)] px-6 text-center transition hover:border-[var(--purple)] hover:bg-[var(--accent-subtle)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--border2)] bg-[var(--bg4)]">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                    <path
                      d="M10 4v8m0 0 3-3m-3 3L7 9M4.5 14.5h11"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-[14px] font-medium text-[var(--text)]">
                  {strategyFile ? strategyFile.name : "Upload your strategy document"}
                </div>
                <div className="mt-2 text-[12px] leading-6 text-[var(--text3)]">
                  PDF, DOCX, MD, or TXT. Perfect for PRDs, notes, and planning docs.
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["PDF", "DOCX", "MD", "TXT"].map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-[var(--border2)] bg-[var(--bg4)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </button>
            </div>
          ) : null}

          {strategyMode === "notion" ? (
            <div className="space-y-4">
              <div className="flex overflow-hidden rounded-[14px] border border-[var(--border2)] bg-[var(--bg3)] transition focus-within:border-[var(--purple)] focus-within:bg-[var(--bg2)]">
                <div className="flex items-center border-r border-[var(--border)] px-4 text-[var(--text3)]">
                  N
                </div>
                <input
                  value={notionUrl}
                  onChange={(event) => onNotionChange(event.target.value)}
                  placeholder="https://www.notion.so/your-product-strategy"
                  className="h-13 min-w-0 flex-1 bg-transparent px-4 font-mono text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--text4)]"
                />
              </div>
              <p className="text-[12px] leading-6 text-[var(--text3)]">
                Paste a public or shared Notion URL. We’ll use it as the source
                for milestone and task generation in the next phase.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
