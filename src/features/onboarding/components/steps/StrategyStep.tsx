import { RefObject, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ROADMAP_GENERATION_LIMIT,
  STRATEGY_TEXT_WARNING_THRESHOLD,
  STRATEGY_TEXT_WORD_LIMIT,
} from "@/lib/onboarding/strategyLimits";

type StrategyMode = "paste" | "upload" | "notion";
type ProductStage = "idea_stage" | "mvp_stage" | "early_users" | "growth_stage";

interface StrategyStepProps {
  productStage: ProductStage;
  strategyMode: StrategyMode;
  strategyText: string;
  strategyWordCount: number;
  notionUrl: string;
  strategyFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onProductStageChange: (value: ProductStage) => void;
  onModeChange: (mode: StrategyMode) => void;
  onTextChange: (value: string) => void;
  onNotionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  uploadHelperText?: string;
  uploadTooltip?: string | null;
  isFileProcessing?: boolean;
  notionHelperText?: string;
  notionStatusText?: string | null;
  isNotionProcessing?: boolean;
  remainingGenerations: number;
}

const modeLabels: Array<{ id: StrategyMode; label: string }> = [
  { id: "paste", label: "Paste text" },
  { id: "upload", label: "Upload file" },
  { id: "notion", label: "Notion link" },
];

const productStageOptions: Array<{
  id: ProductStage;
  label: string;
  description: string;
}> = [
  {
    id: "idea_stage",
    label: "Idea stage",
    description: "just exploring the concept, no product built yet",
  },
  {
    id: "mvp_stage",
    label: "MVP stage",
    description: "currently building the first working version",
  },
  {
    id: "early_users",
    label: "Early users",
    description: "product exists and has initial users or testers",
  },
  {
    id: "growth_stage",
    label: "Growth stage",
    description: "product has traction and needs scaling roadmap",
  },
];

export function StrategyStep({
  productStage,
  strategyMode,
  strategyText,
  strategyWordCount,
  notionUrl,
  strategyFile,
  fileInputRef,
  onProductStageChange,
  onModeChange,
  onTextChange,
  onNotionChange,
  onFileChange,
  uploadHelperText,
  uploadTooltip,
  isFileProcessing,
  notionHelperText,
  notionStatusText,
  isNotionProcessing,
  remainingGenerations,
}: StrategyStepProps) {
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const stageMenuRef = useRef<HTMLDivElement | null>(null);
  const stageMenuId = useId();

  const selectedStageOption = useMemo(
    () => productStageOptions.find((option) => option.id === productStage),
    [productStage],
  );

  const wordCountToneClass =
    strategyWordCount >= STRATEGY_TEXT_WORD_LIMIT
      ? "text-[#fda4af]"
      : strategyWordCount >= STRATEGY_TEXT_WARNING_THRESHOLD
        ? "text-[#facc15]"
        : "text-[var(--text3)]";

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!stageMenuRef.current) return;
      if (!stageMenuRef.current.contains(event.target as Node)) {
        setIsStageMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsStageMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
        <p className="mt-2 text-[12px] leading-6 text-[var(--text3)]">
          For best results, keep strategy concise. Recommended 100–800 words.
        </p>
      </div>

      <div className="grid gap-3">
        <div>
          <div className="text-[12px] font-medium text-[var(--text2)]">
            Product stage
          </div>
          <p className="mt-2 text-[12px] leading-6 text-[var(--text3)]">
            Select the current stage of your product so we can generate a more
            relevant roadmap.
          </p>
        </div>

        <fieldset className="grid gap-3">
          <legend className="sr-only">Product stage</legend>
          <div ref={stageMenuRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isStageMenuOpen}
              aria-controls={stageMenuId}
              onClick={() => setIsStageMenuOpen((open) => !open)}
              className="h-13 w-full rounded-[14px] border border-[var(--border2)] bg-[var(--bg3)] px-4 pr-10 text-left text-[14px] font-medium text-[var(--text)] outline-none transition focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
            >
              {selectedStageOption?.label ?? "MVP stage"}
            </button>
            <input type="hidden" name="product-stage" value={productStage} />
            <span
              className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--text3)] transition duration-200 ${
                isStageMenuOpen ? "rotate-180" : ""
              }`}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div
              id={stageMenuId}
              role="listbox"
              aria-label="Product stage"
              className={`absolute top-[calc(100%+8px)] right-0 left-0 z-20 origin-top rounded-[14px] border border-[var(--border2)] bg-[var(--bg3)] p-1 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition duration-200 ${
                isStageMenuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
              }`}
            >
              {productStageOptions.map((option) => {
                const isSelected = productStage === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onProductStageChange(option.id);
                      setIsStageMenuOpen(false);
                    }}
                    className={`w-full rounded-[10px] px-3 py-2 text-left transition ${
                      isSelected
                        ? "bg-[var(--purple-dim)] text-[var(--text)]"
                        : "text-[var(--text2)] hover:bg-[var(--bg2)]"
                    }`}
                  >
                    <div className="text-[13px] font-medium">{option.label}</div>
                    <div className="mt-1 text-[11px] leading-5 text-[var(--text3)]">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>
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
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={strategyText}
                  onChange={(event) => onTextChange(event.target.value)}
                  placeholder="Paste your Product Development Strategy here. Example: build the MVP, validate onboarding, add Stripe, launch publicly, and measure retention..."
                  className="min-h-[260px] w-full rounded-[14px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-4 pb-10 font-mono text-[13px] leading-7 text-[var(--text2)] outline-none transition placeholder:text-[var(--text4)] focus:border-[var(--purple)] focus:bg-[var(--bg2)]"
                />
                <div
                  className={`pointer-events-none absolute right-4 bottom-3 text-[11px] ${wordCountToneClass}`}
                >
                  {strategyWordCount} / {STRATEGY_TEXT_WORD_LIMIT} words
                </div>
              </div>
              <p className="text-[12px] leading-6 text-[var(--text3)]">
                Beta limit: 1200 words maximum
              </p>
            </div>
          ) : null}

          {strategyMode === "upload" ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
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
                  PDF, DOCX, TXT
                </div>
                <div className="mt-1 text-[12px] leading-6 text-[var(--text3)]">
                  Max 10 pages or approx 5000 words
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["PDF", "DOCX", "TXT"].map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-[var(--border2)] bg-[var(--bg4)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </button>
              {isFileProcessing ? (
                <p className="text-[12px] leading-6 text-[var(--text3)]">
                  Processing file...
                </p>
              ) : null}
              {uploadHelperText ? (
                <p className="text-[12px] leading-6 text-[var(--text3)]">
                  {uploadHelperText}
                </p>
              ) : null}
              {uploadTooltip ? (
                <div className="rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-3 py-2 text-[12px] leading-6 text-[var(--text2)]">
                  {uploadTooltip}
                </div>
              ) : null}
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
                We analyze the first 6000 words for roadmap generation
              </p>
              {isNotionProcessing ? (
                <p className="text-[12px] leading-6 text-[var(--text3)]">
                  Fetching Notion content...
                </p>
              ) : null}
              {notionStatusText ? (
                <p className="text-[12px] leading-6 text-[var(--text3)]">{notionStatusText}</p>
              ) : null}
              {notionHelperText ? (
                <p className="text-[12px] leading-6 text-[var(--text3)]">
                  {notionHelperText}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3">
        <div className="text-[12px] font-medium text-[var(--text2)]">Beta usage</div>
        <div className="mt-1 text-[12px] leading-6 text-[var(--text3)]">
          {remainingGenerations} of {ROADMAP_GENERATION_LIMIT} roadmaps remaining
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg4)]">
          <div
            className="h-full rounded-full bg-[var(--purple)] transition-all"
            style={{
              width: `${(remainingGenerations / ROADMAP_GENERATION_LIMIT) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
