"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { OnboardingSidebar } from "@/features/onboarding/components/OnboardingSidebar";
import { ReviewStep } from "@/features/onboarding/components/steps/ReviewStep";
import { StartupInfoStep } from "@/features/onboarding/components/steps/StartupInfoStep";
import { StrategyStep } from "@/features/onboarding/components/steps/StrategyStep";
import { WorkspaceStep } from "@/features/onboarding/components/steps/WorkspaceStep";

type StrategyMode = "paste" | "upload" | "notion";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [startupName, setStartupName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [strategyMode, setStrategyMode] = useState<StrategyMode>("paste");
  const [strategyText, setStrategyText] = useState("");
  const [notionUrl, setNotionUrl] = useState("");
  const [strategyFile, setStrategyFile] = useState<File | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");

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

      if (strategyMode === "notion" && !notionUrl.trim()) {
        return "Add a Notion link before continuing.";
      }
    }

    return "";
  }

  function handleNext() {
    const validationError = validateStep(currentStep);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    updateCompletion(currentStep);

    if (currentStep < 3) {
      setCurrentStep((step) => step + 1);
      return;
    }
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
          strategyMode={strategyMode}
          strategyText={strategyText}
          notionUrl={notionUrl}
          strategyFile={strategyFile}
          fileInputRef={fileInputRef}
          onModeChange={setStrategyMode}
          onTextChange={setStrategyText}
          onNotionChange={setNotionUrl}
          onFileChange={setStrategyFile}
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
      />
    );
  }

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
              radial-gradient(circle, rgba(169, 157, 254, 0.38) 0%, rgba(169, 157, 254, 0.16) 42%, rgba(169, 157, 254, 0) 74%);
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

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-4 flex items-center justify-between px-1">
          <Logo />
          <Link
            href="/"
            className="text-[13px] text-[var(--text3)] transition hover:text-[var(--text)]"
          >
            Back home
          </Link>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--bg2)] shadow-[0_24px_80px_rgba(0,0,0,0.24)] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <OnboardingSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepSelect={setCurrentStep}
          />

          <section className="min-h-[720px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="mx-auto flex min-h-full max-w-[760px] flex-col">
              {renderStep()}

              {error ? (
                <div className="mt-6 rounded-[12px] border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[13px] text-[#fda4af]">
                  {error}
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
                    className="h-11 rounded-[12px] bg-[var(--purple)] px-5 text-[14px] font-medium text-white transition hover:bg-[var(--purple3)]"
                  >
                    {primaryActionLabel}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
