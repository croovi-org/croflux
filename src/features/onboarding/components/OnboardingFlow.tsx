"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { OnboardingSidebar } from "@/features/onboarding/components/OnboardingSidebar";
import { ReviewStep } from "@/features/onboarding/components/steps/ReviewStep";
import { StartupInfoStep } from "@/features/onboarding/components/steps/StartupInfoStep";
import { StrategyStep } from "@/features/onboarding/components/steps/StrategyStep";
import { WorkspaceStep } from "@/features/onboarding/components/steps/WorkspaceStep";
import {
  FILE_SIZE_LIMIT_BYTES,
  FILE_WORD_LIMIT,
  NOTION_WORD_LIMIT,
  ROADMAP_GENERATION_LIMIT,
  STRATEGY_TEXT_WORD_LIMIT,
  countWords,
  truncateToWordLimit,
} from "@/lib/onboarding/strategyLimits";

type StrategyMode = "paste" | "upload" | "notion";
type ProductStage = "idea_stage" | "mvp_stage" | "early_users" | "growth_stage";

type UsageResponse = {
  used: number;
  remaining: number;
  limit: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

export function OnboardingFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [startupName, setStartupName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [productStage, setProductStage] = useState<ProductStage>("mvp_stage");
  const [strategyMode, setStrategyMode] = useState<StrategyMode>("paste");
  const [strategyText, setStrategyText] = useState("");
  const [notionUrl, setNotionUrl] = useState("");
  const [strategyFile, setStrategyFile] = useState<File | null>(null);
  const [fileExtractedText, setFileExtractedText] = useState("");
  const [fileWordCount, setFileWordCount] = useState(0);
  const [fileProcessingError, setFileProcessingError] = useState("");
  const [fileProcessingNotice, setFileProcessingNotice] = useState("");
  const [fileProcessingTooltip, setFileProcessingTooltip] = useState<string | null>(null);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [notionExtractedText, setNotionExtractedText] = useState("");
  const [notionWordCount, setNotionWordCount] = useState(0);
  const [notionError, setNotionError] = useState("");
  const [notionStatus, setNotionStatus] = useState("");
  const [isNotionProcessing, setIsNotionProcessing] = useState(false);
  const [usage, setUsage] = useState<UsageResponse>({
    used: 0,
    remaining: ROADMAP_GENERATION_LIMIT,
    limit: ROADMAP_GENERATION_LIMIT,
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(1);

  const strategyWordCount = useMemo(() => countWords(strategyText), [strategyText]);
  const activeStrategyText = useMemo(() => {
    if (strategyMode === "upload") return fileExtractedText.trim();
    if (strategyMode === "notion") return notionExtractedText.trim();
    return strategyText.trim();
  }, [fileExtractedText, notionExtractedText, strategyMode, strategyText]);
  const activeStrategyWordCount = useMemo(
    () => countWords(activeStrategyText),
    [activeStrategyText],
  );

  const onboardingPayload = useMemo(
    () => ({
      startup_name: startupName.trim(),
      one_liner: oneLiner.trim(),
      workspace_name: workspaceName.trim(),
      slug: slug.trim(),
      product_stage: productStage,
      strategy: {
        mode: strategyMode,
        text: activeStrategyText,
        notion_url: notionUrl.trim(),
        file_name: strategyFile?.name ?? null,
        text_word_count: activeStrategyWordCount,
      },
    }),
    [
      startupName,
      oneLiner,
      workspaceName,
      slug,
      productStage,
      strategyMode,
      activeStrategyText,
      notionUrl,
      strategyFile,
      activeStrategyWordCount,
    ],
  );

  const canGoBack = currentStep > 0;
  const isReviewStep = currentStep === 3;

  const primaryActionLabel = useMemo(() => {
    if (isReviewStep) return "Generate roadmap →";
    return "Continue →";
  }, [isReviewStep]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadUsage() {
      const response = await fetch("/api/onboarding/usage", { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as UsageResponse;
      if (!active) return;
      setUsage({
        used: Math.max(0, payload.used ?? 0),
        remaining: Math.max(0, payload.remaining ?? ROADMAP_GENERATION_LIMIT),
        limit: payload.limit ?? ROADMAP_GENERATION_LIMIT,
      });
    }

    void loadUsage();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (strategyMode !== "notion") return;
    const trimmedUrl = notionUrl.trim();

    if (!trimmedUrl) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsNotionProcessing(true);
      setNotionError("");
      setNotionStatus("");

      const response = await fetch("/api/onboarding/strategy/extract-notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notionUrl: trimmedUrl }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            text?: string;
            usedWordCount?: number;
            wasTruncated?: boolean;
            warning?: string;
            error?: string;
          }
        | null;

      if (!response.ok) {
        setNotionExtractedText("");
        setNotionWordCount(0);
        setNotionError(
          payload?.error ??
            "Notion content extraction failed. Please try another link.",
        );
        setIsNotionProcessing(false);
        return;
      }

      const text = payload?.text ?? "";
      setNotionExtractedText(text);
      setNotionWordCount(Math.min(payload?.usedWordCount ?? countWords(text), NOTION_WORD_LIMIT));
      setNotionStatus(payload?.wasTruncated ? payload?.warning ?? "" : "");
      setIsNotionProcessing(false);
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [notionUrl, strategyMode]);

  function updateCompletion(step: number) {
    setCompletedSteps((previous) =>
      previous.includes(step) ? previous : [...previous, step],
    );
  }

  function handleStartupChange(field: "startupName" | "oneLiner", value: string) {
    setError("");

    if (field === "startupName") {
      setStartupName(value);

      if (!workspaceName) {
        setWorkspaceName(value ? `${value} Workspace` : "");
      }

      if (!slugEdited) {
        setSlug(slugify(value));
      }

      return;
    }

    setOneLiner(value);
  }

  function handleWorkspaceChange(field: "workspaceName" | "slug", value: string) {
    setError("");

    if (field === "workspaceName") {
      setWorkspaceName(value);
      if (!slugEdited) {
        setSlug(slugify(value));
      }
      return;
    }

    setSlugEdited(true);
    setSlug(slugify(value));
  }

  function handleStrategyModeChange(mode: StrategyMode) {
    setError("");
    setStrategyMode(mode);
    if (mode !== "notion") {
      setNotionError("");
      setNotionStatus("");
      setIsNotionProcessing(false);
    }
  }

  function handleStrategyTextChange(value: string) {
    setError("");
    const truncated = truncateToWordLimit(value, STRATEGY_TEXT_WORD_LIMIT);
    setStrategyText(truncated.text);
  }

  function handleNotionChange(value: string) {
    setError("");
    setNotionUrl(value);
    if (!value.trim()) {
      setNotionExtractedText("");
      setNotionWordCount(0);
      setNotionError("");
      setNotionStatus("");
    }
  }

  async function handleFileChange(file: File | null) {
    setError("");
    setStrategyFile(file);
    setFileExtractedText("");
    setFileWordCount(0);
    setFileProcessingError("");
    setFileProcessingNotice("");
    setFileProcessingTooltip(null);

    if (!file) {
      return;
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      setFileProcessingError("File must be 5MB or smaller.");
      return;
    }

    setIsFileProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/onboarding/strategy/extract-file", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          text?: string;
          usedWordCount?: number;
          wasTruncated?: boolean;
          warning?: string;
          estimatedPageCount?: number;
          error?: string;
        }
      | null;

    if (!response.ok) {
      setFileProcessingError(
        payload?.error ?? "File exceeds beta limits and cannot be processed.",
      );
      setIsFileProcessing(false);
      return;
    }

    const extractedText = payload?.text ?? "";
    const usedWordCount = Math.min(
      payload?.usedWordCount ?? countWords(extractedText),
      FILE_WORD_LIMIT,
    );
    setFileExtractedText(extractedText);
    setFileWordCount(usedWordCount);
    setFileProcessingNotice(
      `Concise strategies produce better roadmaps. We will use ${usedWordCount} words from this document.`,
    );
    setFileProcessingTooltip(payload?.wasTruncated ? payload.warning ?? null : null);
    setFileProcessingError("");
    setIsFileProcessing(false);
  }

  function validateStep(step: number) {
    if (step === 0) {
      if (!startupName.trim() || !oneLiner.trim()) {
        return "Add your startup name and one-line description.";
      }
    }

    if (step === 1) {
      if (!workspaceName.trim() || !slug.trim()) {
        return "Set a workspace name and confirm the URL slug.";
      }
    }

    if (step === 2) {
      if (strategyMode === "paste" && !strategyText.trim()) {
        return "Paste your strategy before continuing.";
      }

      if (strategyMode === "upload" && !strategyFile) {
        return "Upload a strategy file before continuing.";
      }

      if (strategyMode === "upload" && !fileExtractedText.trim()) {
        return fileProcessingError || "File exceeds beta limits and cannot be processed.";
      }

      if (strategyMode === "notion" && !notionUrl.trim()) {
        return "Add a Notion link before continuing.";
      }

      if (strategyMode === "notion" && !notionExtractedText.trim()) {
        return notionError || "Notion content extraction failed.";
      }
    }

    return "";
  }

  function getStepGuardrailError(step: number) {
    if (step === 3 && usage.remaining <= 0) {
      return "Beta limit reached. Upgrade to continue generating roadmaps.";
    }

    if (step !== 2) {
      return "";
    }

    if (strategyMode === "paste" && strategyWordCount > STRATEGY_TEXT_WORD_LIMIT) {
      return "Strategy too long. Please keep within 1200 words for best results.";
    }

    if (strategyMode === "upload") {
      if (isFileProcessing) return "Processing file. Please wait.";
      if (fileProcessingError) return fileProcessingError;
      if (strategyFile && !fileExtractedText.trim()) {
        return "File exceeds beta limits and cannot be processed.";
      }
    }

    if (strategyMode === "notion") {
      if (isNotionProcessing) return "Fetching Notion content. Please wait.";
      if (notionError) return notionError;
      if (notionUrl.trim() && !notionExtractedText.trim()) {
        return "Notion content extraction failed.";
      }
    }

    return "";
  }

  async function validateStrategyServerSide() {
    const response = await fetch("/api/onboarding/strategy/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        strategyMode,
        textInputWords: strategyWordCount,
        fileWords: fileWordCount,
        notionWords: notionWordCount,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { error?: string; remainingGenerations?: number }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "Unable to validate strategy right now.");
    }

    if (typeof payload?.remainingGenerations === "number") {
      const nextRemaining = payload.remainingGenerations;
      setUsage((current) => ({
        ...current,
        remaining: nextRemaining,
      }));
    }
  }

  async function handleNext() {
    const validationError = validateStep(currentStep);
    const guardrailError = getStepGuardrailError(currentStep);

    if (validationError || guardrailError) {
      setError(validationError || guardrailError);
      return;
    }

    try {
      if (currentStep === 2 || currentStep === 3) {
        await validateStrategyServerSide();
      }
    } catch (validationErrorFromServer) {
      setError(
        validationErrorFromServer instanceof Error
          ? validationErrorFromServer.message
          : "Unable to validate strategy right now.",
      );
      return;
    }

    setError("");
    updateCompletion(currentStep);

    if (currentStep === 3) {
      setIsGenerating(true);
      setGenStep(1);

      const timers = [
        window.setTimeout(() => setGenStep(2), 1200),
        window.setTimeout(() => setGenStep(3), 2600),
        window.setTimeout(() => setGenStep(4), 4200),
      ];

      try {
        const res = await fetch("/api/generate-roadmap", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: startupName.trim(),
            idea: oneLiner.trim(),
            strategy: activeStrategyText.trim(),
            workspace_name: workspaceName.trim(),
            workspace_slug: slug.trim(),
          }),
        });

        const data = (await res.json().catch(() => null)) as
          | { success?: boolean; error?: string; data?: { project_id?: string } }
          | null;

        if (!res.ok || !data?.success || !data?.data?.project_id) {
          throw new Error(data?.error || "Failed to generate roadmap");
        }

        router.push(`/dashboard/${data.data.project_id}`);
      } catch (generationError) {
        setIsGenerating(false);
        setError(
          generationError instanceof Error
            ? generationError.message
            : "Failed to generate roadmap",
        );
      } finally {
        timers.forEach((timer) => window.clearTimeout(timer));
      }

      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function handleBack() {
    setError("");
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <StartupInfoStep
          startupName={startupName}
          oneLiner={oneLiner}
          onChange={handleStartupChange}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <WorkspaceStep
          workspaceName={workspaceName}
          slug={slug}
          onChange={handleWorkspaceChange}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <StrategyStep
          productStage={productStage}
          strategyMode={strategyMode}
          strategyText={strategyText}
          strategyWordCount={strategyWordCount}
          notionUrl={notionUrl}
          strategyFile={strategyFile}
          fileInputRef={fileInputRef}
          onProductStageChange={setProductStage}
          onModeChange={handleStrategyModeChange}
          onTextChange={handleStrategyTextChange}
          onNotionChange={handleNotionChange}
          onFileChange={handleFileChange}
          uploadHelperText={fileProcessingNotice || undefined}
          uploadTooltip={fileProcessingTooltip}
          isFileProcessing={isFileProcessing}
          notionHelperText="Concise strategies produce better roadmaps."
          notionStatusText={notionStatus || undefined}
          isNotionProcessing={isNotionProcessing}
        />
      );
    }

    return (
      <ReviewStep
        startupName={startupName}
        oneLiner={oneLiner}
        workspaceName={workspaceName}
        slug={slug}
        strategyMode={strategyMode}
        strategyText={strategyText}
        strategyFile={strategyFile}
        notionUrl={notionUrl}
        activeStrategyText={activeStrategyText}
        activeStrategyWordCount={activeStrategyWordCount}
      />
    );
  }

  const stepGuardrailError = getStepGuardrailError(currentStep);
  const displayedError = error || stepGuardrailError;
  const continueDisabled =
    currentStep === 2
      ? Boolean(stepGuardrailError)
      : currentStep === 3
        ? usage.remaining <= 0
        : false;

  if (showIntro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
        <div className="flex flex-col items-center text-center">
          <div className="onboarding-intro-mark onboarding-intro-breathe onboarding-intro-reveal">
            <div className="onboarding-intro-mark-shell">
              <div className="onboarding-intro-mark-glow" />
              <Image
                src="/croflux-mark.png"
                alt="CroFlux"
                width={120}
                height={120}
                priority
                className="onboarding-intro-mark-image"
              />
            </div>
          </div>
          <p className="onboarding-intro-copy onboarding-intro-reveal mt-6 text-[15px] leading-7 text-[var(--text3)]">
            Tuning your founder cockpit...
          </p>
        </div>
        <style jsx>{`
          .onboarding-intro-mark {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
            animation: onboardingReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .onboarding-intro-mark-shell {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 132px;
            height: 132px;
          }

          .onboarding-intro-mark-image {
            position: relative;
            z-index: 2;
            width: 96px;
            height: auto;
            object-fit: contain;
          }

          .onboarding-intro-mark-glow {
            position: absolute;
            inset: 18px;
            border-radius: 999px;
            background:
              radial-gradient(circle, color-mix(in srgb, var(--accent) 38%, transparent) 0%, color-mix(in srgb, var(--accent) 16%, transparent) 42%, transparent 74%);
            filter: blur(18px);
            z-index: 1;
          }

          .onboarding-intro-copy {
            opacity: 0;
            transform: translateY(10px);
            animation: onboardingReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards;
          }

          .onboarding-intro-breathe {
            animation:
              onboardingReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards,
              onboardingBreathe 2.2s ease-in-out 0.75s infinite;
          }

          @keyframes onboardingReveal {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes onboardingBreathe {
            0%,
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }

            50% {
              transform: translateY(-2px) scale(1.02);
              opacity: 0.92;
            }
          }

          .onboarding-intro-breathe :global(.onboarding-intro-mark-image) {
            animation: onboardingMarkPulse 2.4s ease-in-out infinite;
          }

          .onboarding-intro-breathe :global(.onboarding-intro-mark-glow) {
            animation: onboardingGlowPulse 2.4s ease-in-out infinite;
          }

          @keyframes onboardingMarkPulse {
            0%,
            100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.035);
            }
          }

          @keyframes onboardingGlowPulse {
            0%,
            100% {
              opacity: 0.7;
              transform: scale(0.98);
              filter: blur(18px);
            }

            50% {
              opacity: 1;
              transform: scale(1.08);
              filter: blur(24px);
            }
          }
        `}</style>
      </main>
    );
  }

  if (isGenerating) {
    return <GeneratingScreen step={genStep} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[44px] h-[980px] w-[1520px] -translate-x-1/2 opacity-100"
        style={{ background: "var(--hero-glow)" }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[120px] h-[760px] w-[1180px] -translate-x-1/2 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 32%, transparent) 0%, color-mix(in srgb, var(--accent) 16%, transparent) 42%, transparent 78%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(circle at top center, black 28%, rgba(0,0,0,0.45) 58%, transparent 88%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, var(--accent-subtle), transparent 26%), radial-gradient(circle at 82% 18%, var(--accent-subtle), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.015), transparent 18%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1280px]">
        <div className="mb-10 flex items-center justify-between px-1 lg:mb-14">
          <Logo />
          <Link
            href="/"
            className="text-[13px] text-[var(--text3)] transition hover:text-[var(--text)]"
          >
            Back home
          </Link>
        </div>

        <div className="relative overflow-visible rounded-[24px] lg:-translate-y-3 lg:[transform:perspective(1800px)_rotateX(3.8deg)_translateY(-6px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-42px] rounded-[52px] opacity-100 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 14%, var(--accent-muted) 0%, color-mix(in srgb, var(--accent) 9%, transparent) 28%, color-mix(in srgb, var(--accent) 4%, transparent) 48%, transparent 76%), radial-gradient(circle at 12% 50%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, color-mix(in srgb, var(--accent) 4%, transparent) 24%, transparent 56%), radial-gradient(circle at 88% 54%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, color-mix(in srgb, var(--accent) 4%, transparent) 22%, transparent 52%), radial-gradient(circle at 50% 94%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, color-mix(in srgb, var(--accent) 4%, transparent) 26%, transparent 60%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-2px] rounded-[26px]"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--accent) 19%, transparent) 0%, var(--accent-subtle) 24%, rgba(255,255,255,0.02) 48%, var(--accent-subtle) 100%)",
              boxShadow:
                "0 0 0 1px color-mix(in srgb, var(--accent) 5%, transparent), 0 0 20px color-mix(in srgb, var(--accent) 7%, transparent)",
            }}
          />
          <div
            className="relative overflow-hidden rounded-[24px] bg-[var(--bg2)] backdrop-blur-sm lg:grid lg:grid-cols-[260px_minmax(0,1fr)]"
            style={{
              border: "1px solid color-mix(in srgb, var(--accent) 14%, transparent)",
              boxShadow:
                "0 72px 180px rgba(0,0,0,0.52), 0 34px 84px rgba(0,0,0,0.34), 0 10px 22px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.02), 0 0 48px color-mix(in srgb, var(--accent) 7%, transparent)",
            }}
          >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[12%] top-[-160px] h-[420px] rounded-full opacity-45 blur-3xl"
            style={{ background: "var(--hero-glow)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[8%] top-[14%] h-[320px] w-[320px] rounded-full opacity-18 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent) 0%, color-mix(in srgb, var(--accent) 10%, transparent) 48%, transparent 78%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[6%] bottom-[8%] h-[280px] w-[280px] rounded-full opacity-16 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, color-mix(in srgb, var(--accent) 9%, transparent) 50%, transparent 78%)",
            }}
          />
          <OnboardingSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepSelect={setCurrentStep}
          />

          <section className="min-h-[720px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div
              className="mx-auto flex min-h-full max-w-[760px] flex-col"
              data-product-stage={onboardingPayload.product_stage}
            >
              {renderStep()}

              {currentStep === 3 ? (
                <div className="mt-6 rounded-[12px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3">
                  <div className="text-[12px] font-medium text-[var(--text2)]">
                    Beta usage
                  </div>
                  <div className="mt-1 text-[12px] leading-6 text-[var(--text3)]">
                    {usage.remaining} of {ROADMAP_GENERATION_LIMIT} roadmap
                    generations remaining
                  </div>
                  <div className="mt-1 text-[12px] leading-6 text-[var(--text4)]">
                    Generating a roadmap will use 1 credit.
                  </div>
                </div>
              ) : null}

              {displayedError ? (
                <div className="mt-6 rounded-[12px] border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[13px] text-[#fda4af]">
                  {displayedError}
                </div>
              ) : null}

              <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[12px] leading-6 text-[var(--text3)]">
                  Minimal setup now. Full roadmap editing comes next.
                </div>

                <div className="flex items-center gap-3 self-end">
                  {canGoBack ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="h-11 rounded-[12px] border border-[var(--border2)] bg-transparent px-5 text-[14px] text-[var(--text2)] transition hover:border-[var(--border3)] hover:text-[var(--text)]"
                    >
                      Back
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={continueDisabled}
                    className="h-11 rounded-[12px] bg-[var(--purple)] px-5 text-[14px] font-medium text-white transition hover:bg-[var(--purple3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--purple)]"
                  >
                    {primaryActionLabel}
                  </button>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function GeneratingScreen({ step }: { step: number }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <div className="w-full max-w-[560px] rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-7">
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--text)]">
          Building your roadmap.
        </h2>
        <div className="mt-5 space-y-3 text-[14px]">
          <StepRow active={step >= 1} done={step > 1} label="Analyzing idea" />
          <StepRow
            active={step >= 2}
            done={step > 2}
            label="Creating roadmap structure"
          />
          <StepRow active={step >= 3} done={step > 3} label="Breaking into tasks" />
          <StepRow active={step >= 4} done={false} label="Assigning XP" />
        </div>
      </div>
    </main>
  );
}

function StepRow({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  const marker = done ? "✓" : active ? "•" : "○";
  return (
    <div className={active ? "text-[var(--text)]" : "text-[var(--text3)]"}>
      <span className="inline-block w-5">{marker}</span>
      {label}
    </div>
  );
}
