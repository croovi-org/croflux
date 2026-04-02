"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Logo } from "@/components/shared/logo";

const tickerMsgs = [
  "Riya K. just completed: Launch landing page",
  "Dev M. defeated Boss: MVP Launch",
  "34 builders active right now",
  "Sara K. started: User onboarding flow",
  "1,284 tasks shipped today",
  "Jay L. extended streak to 3 days",
  "New builder joined: Aarav M. — Nexly",
  "Priya K. completed: Stripe integration",
  "Top builder this week: Riya K. with 34 tasks",
  "Aarav M. defeated Boss: CLI Foundation",
];

const liveBuilders = [
  { initials: "RK", name: "Riya K.", project: "Noteship", score: "34" },
  { initials: "DM", name: "Dev M.", project: "APIFlow", score: "28" },
  { initials: "SK", name: "Sara K.", project: "Formify", score: "21" },
  { initials: "JL", name: "Jay L.", project: "Stackr", score: "17" },
  { initials: "AM", name: "Aarav M.", project: "Nexly", score: "14" },
  { initials: "PK", name: "Priya K.", project: "FlowCast", score: "11" },
];

const ctaMsgs = [
  "247 builders active right now",
  "1,284 tasks shipped today",
  "34 boss milestones defeated this week",
  "92% daily retention among builders",
];

const howWorkflows = [
  {
    id: "roadmap",
    tab: "Roadmap Engine",
    caption: "PDS to milestones",
    promptTitle: "Product Development Strategy uploaded",
    promptBody:
      "Build CroFlux as a startup execution system for indie hackers. Start with roadmap generation, milestone tracking, boss battles, streaks, and a weekly leaderboard.",
    promptTags: ["Builder workflow", "MVP scope", "Execution system"],
    steps: [
      {
        label: "Reading PDS",
        title: "AI analyzes the strategy",
        subtitle: "CroFlux maps product intent, launch scope, and build order.",
        metricLabel: "Strategy parsed",
        metricValue: "24%",
      },
      {
        label: "Generating milestones",
        title: "Milestones appear automatically",
        subtitle:
          "4 launch phases are drafted in the right sequence for the builder.",
        metricLabel: "Milestones drafted",
        metricValue: "4/4",
      },
      {
        label: "Expanding tasks",
        title: "Tasks are attached to each milestone",
        subtitle:
          "Every phase gets focused actions instead of vague planning notes.",
        metricLabel: "Tasks generated",
        metricValue: "16",
      },
      {
        label: "Assigning bosses",
        title: "Major phases become boss milestones",
        subtitle:
          "CroFlux turns critical launch stages into boss battles to keep momentum high.",
        metricLabel: "Bosses tagged",
        metricValue: "2",
      },
    ],
  },
  {
    id: "execution",
    tab: "Execution Loop",
    caption: "Tasks to momentum",
    promptTitle: "Daily execution is underway",
    promptBody:
      "The builder is checking off tasks every day, maintaining streaks, and pushing toward the next milestone while rank updates live.",
    promptTags: ["Task completions", "Streak tracking", "Leaderboard climb"],
    steps: [
      {
        label: "Completing tasks",
        title: "Tasks get checked off live",
        subtitle:
          "Daily work turns into visible progress instead of staying buried in a to-do list.",
        metricLabel: "Tasks shipped today",
        metricValue: "5",
      },
      {
        label: "Closing milestones",
        title: "Milestones close as work stacks up",
        subtitle:
          "Completed tasks roll into milestone completion and unlock the next stage.",
        metricLabel: "Milestone progress",
        metricValue: "75%",
      },
      {
        label: "Earning momentum",
        title: "Builders gain points, streaks, and rank",
        subtitle:
          "Each completion feeds streaks, leaderboard movement, and momentum messages.",
        metricLabel: "Leaderboard rank",
        metricValue: "#8",
      },
    ],
  },
  {
    id: "boss",
    tab: "Boss & Launch",
    caption: "Bosses to launch",
    promptTitle: "Launch push is active",
    promptBody:
      "The builder is draining a boss milestone, clearing final blockers, and moving from beta prep to launch with public momentum.",
    promptTags: ["Boss battle", "Launch prep", "Leaderboard gain"],
    steps: [
      {
        label: "Draining boss HP",
        title: "Boss milestone health drops with every completed task",
        subtitle:
          "CroFlux frames the hard phase as a visible challenge instead of a boring checklist.",
        metricLabel: "Boss HP",
        metricValue: "62%",
      },
      {
        label: "Defeating the boss",
        title: "The milestone is defeated and launch unlocks",
        subtitle:
          "One last push clears the blocker and opens the final launch checklist.",
        metricLabel: "Boss defeated",
        metricValue: "Unlocked",
      },
      {
        label: "Shipping the product",
        title: "The builder launches and climbs ahead",
        subtitle:
          "Product launched. Rank improves. Momentum spills into the next build cycle.",
        metricLabel: "Launch status",
        metricValue: "Live",
      },
    ],
  },
] as const;

export function LandingPage() {
  const router = useRouter();
  const [appearance, setAppearance] = useState<"dark" | "light">("dark");
  const [appearanceReady, setAppearanceReady] = useState(false);
  const [taskCount, setTaskCount] = useState(1284);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [heroEntered, setHeroEntered] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [featureProgress, setFeatureProgress] = useState(20);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [workflowSceneVisible, setWorkflowSceneVisible] = useState(true);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const featureProgressRef = useRef<HTMLDivElement | null>(null);
  const workflowTransitionRef = useRef<number | null>(null);

  const applyTheme = (nextAppearance: "dark" | "light") => {
    setAppearance(nextAppearance);
    document.documentElement.dataset.appearance = nextAppearance;
    localStorage.setItem("croflux-appearance", nextAppearance);

    const href = "/croflux-mark.png";
    ["icon", "shortcut icon", "apple-touch-icon"].forEach((rel) => {
      let link = document.querySelector(
        `link[rel="${rel}"]`,
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    });
  };

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);

    if (search.has("code")) {
      router.replace(`/auth/callback?${search.toString()}`);
      return;
    }

    if (
      hashParams.get("type") === "recovery" ||
      hashParams.has("access_token") ||
      search.has("error") ||
      search.has("error_code")
    ) {
      const nextQuery = search.toString();
      const nextHash = hash ? `#${hash}` : "";
      router.replace(`/reset-password${nextQuery ? `?${nextQuery}` : ""}${nextHash}`);
      return;
    }
  }, [router]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const currentAppearance =
        document.documentElement.dataset.appearance === "light" ? "light" : "dark";
      setAppearance(currentAppearance);
      setAppearanceReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;

    frameId = window.requestAnimationFrame(() => {
      setHeroEntered(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const counter = window.setInterval(() => {
      setTaskCount((current) => current + Math.floor(Math.random() * 3));
    }, 4500);

    const cta = window.setInterval(() => {
      setCtaIndex((current) => (current + 1) % ctaMsgs.length);
    }, 3500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => {
      window.clearInterval(counter);
      window.clearInterval(cta);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const target = 48;
    let frameId = 0;
    let startTime = 0;

    const animatePreview = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const duration = 900;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);

      setPreviewProgress(Math.round(target * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animatePreview);
      }
    };

    frameId = window.requestAnimationFrame(animatePreview);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (workflowTransitionRef.current !== null) {
        window.clearTimeout(workflowTransitionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const getScrollProgress = (
      element: HTMLDivElement | null,
      min: number,
      max: number,
    ) => {
      if (!element) {
        return min;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.9;
      const end = viewportHeight * 0.22;
      const ratio = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, ratio));

      return Math.round(min + (max - min) * clamped);
    };

    const updateProgress = () => {
      setFeatureProgress(getScrollProgress(featureProgressRef.current, 20, 63));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const workflow = howWorkflows[activeWorkflow];
    const loop = window.setTimeout(() => {
      setWorkflowSceneVisible(false);

      workflowTransitionRef.current = window.setTimeout(() => {
        if (activeWorkflowStep >= workflow.steps.length - 1) {
          setActiveWorkflow((current) => (current + 1) % howWorkflows.length);
          setActiveWorkflowStep(0);
          setWorkflowSceneVisible(true);
          return;
        }

        setActiveWorkflowStep((current) => current + 1);
        setWorkflowSceneVisible(true);
      }, 180);
    }, 2400);

    return () => {
      window.clearTimeout(loop);
      if (workflowTransitionRef.current !== null) {
        window.clearTimeout(workflowTransitionRef.current);
        workflowTransitionRef.current = null;
      }
    };
  }, [activeWorkflow, activeWorkflowStep]);

  const tickerItems = [...tickerMsgs, ...tickerMsgs];
  const currentWorkflow = howWorkflows[activeWorkflow];
  const currentWorkflowStep = currentWorkflow.steps[activeWorkflowStep];
  const waitlistHref = "#waitlist";

  const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!waitlistEmail.trim()) {
      setWaitlistState("error");
      setWaitlistMessage("Enter your email to join the waitlist.");
      return;
    }

    setWaitlistState("loading");
    setWaitlistMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: waitlistEmail.trim() }),
      });

      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setWaitlistState("error");
        setWaitlistMessage(
          payload.error ?? "Unable to join the waitlist right now.",
        );
        return;
      }

      setWaitlistState("success");
      setWaitlistMessage(payload.message ?? "You’re on the waitlist.");
      setWaitlistEmail("");
    } catch {
      setWaitlistState("error");
      setWaitlistMessage("Unable to join the waitlist right now.");
    }
  };

  return (
    <>
      <nav>
        <div className="nav-inner">
          <Logo href="/" className="nav-logo" markClassName="nav-logo-mark" />
          <div className="nav-links">
            <Link href="#features" className="nav-link">
              Features
            </Link>
            <Link href="#how" className="nav-link">
              How it works
            </Link>
            <Link href="#pricing" className="nav-link">
              Pricing
            </Link>
          </div>
          <div className="nav-right">
            <button
              type="button"
              className="nav-theme-toggle"
              aria-label={
                appearanceReady
                  ? appearance === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                  : "Toggle theme"
              }
              onClick={() => applyTheme(appearance === "dark" ? "light" : "dark")}
            >
              {appearance === "dark" ? (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle
                    cx="10"
                    cy="10"
                    r="3.6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M10 1.8V4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 16V18.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.2 10H16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 10H1.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.8 4.2L14.2 5.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5.8 14.2L4.2 15.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.8 15.8L14.2 14.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5.8 5.8L4.2 4.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M15.9 12.9A6.9 6.9 0 0 1 7.1 4.1 7.4 7.4 0 1 0 15.9 12.9Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="nav-menu-toggle"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 5.5H16.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.5 10H16.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.5 14.5H16.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <Link href={waitlistHref} className="nav-login">
              Waitlist
            </Link>
            <Link href={waitlistHref} className="nav-cta">
              Join Waitlist →
            </Link>
          </div>
        </div>
        <div className={`nav-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <Link
            href="#features"
            className="nav-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#how"
            className="nav-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="nav-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href={waitlistHref}
            className="nav-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Waitlist
          </Link>
          <Link
            href={waitlistHref}
            className="nav-mobile-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Join Waitlist →
          </Link>
        </div>
      </nav>
      ...
      <div className="ticker">
        <div className="ticker-inner">
          {tickerItems.map((msg, index) => (
            <div key={`${msg}-${index}`} className="ticker-item">
              <span className="ticker-dot" />
              {msg}
            </div>
          ))}
        </div>
      </div>
      <div className="hero">
        <div className={`hero-shell ${heroEntered ? "hero-entered" : ""}`}>
          <div className="hero-inner">
            <div className="hero-badge">
              <div className="hero-badge-dot">
                <svg viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3" fill="white" />
                </svg>
              </div>
              Now in beta · 247 builders shipping daily
            </div>
            <h1 className="hero-h">
              <span className="hero-line">
                <span className="hero-line-text">Track your startup</span>
              </span>
              <span className="hero-line">
                <span className="hero-line-text">
                  from idea to <span className="gradient">launch.</span>
                </span>
              </span>
            </h1>
            <p className="hero-sub">
              Turn your Product Development Strategy into milestones, tasks, and
              real progress. Ship daily. Beat the bosses. Climb the board.
            </p>
            <div className="hero-btns">
              <Link href={waitlistHref} className="btn-primary">
                Join the Waitlist →
              </Link>
              <Link href="#how" className="btn-ghost">
                See how it works
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-val purple">247</div>
                <div className="hero-stat-lbl">Active builders</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val amber">
                  {(taskCount / 1000).toFixed(1)}k
                </div>
                <div className="hero-stat-lbl">Tasks shipped / week</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val purple">92%</div>
                <div className="hero-stat-lbl">Daily retention</div>
              </div>
            </div>
          </div>

          <div ref={previewRef} className="preview-wrap hero-preview reveal">
            <div className="preview-bar">
              <div className="preview-dots">
                <div className="pv-dot" />
                <div className="pv-dot" />
                <div className="pv-dot" />
              </div>
              <div className="preview-url">croflux.app/dashboard</div>
            </div>
            <div className="preview-layout">
              <div className="pv-sidebar">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 28,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src="/croflux-mark.png"
                      alt=""
                      fill
                      sizes="92px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <span style={{ color: "var(--text)" }}>Cro</span>
                    <span style={{ color: "var(--accent)" }}>Flux</span>
                  </span>
                </div>
                <div className="pv-sb-section">Workspace</div>
                <div className="pv-sb-item active">Dashboard</div>
                <div className="pv-sb-item">Milestones</div>
                <div className="pv-sb-item">Activity</div>
                <div className="pv-sb-section">Community</div>
                <div className="pv-sb-item">Leaderboard</div>
              </div>
              <div className="pv-main">
                <div className="pv-header">
                  <div>
                    <div className="pv-project-name">AI Debugger</div>
                    <div className="pv-project-sub">
                      CLI tool for developers · Building in public
                    </div>
                  </div>
                  <div className="pv-status">
                    <svg width="6" height="6" viewBox="0 0 6 6">
                      <circle cx="3" cy="3" r="3" fill="#22c55e" />
                    </svg>
                    Active
                  </div>
                </div>
                <div className="pv-prog-row">
                  <span className="pv-prog-lbl">Progress</span>
                  <span className="pv-prog-val">{previewProgress}%</span>
                </div>
                <div className="pv-track">
                  <div
                    className="pv-fill"
                    style={{ width: `${previewProgress}%` }}
                  />
                </div>
                <div className="pv-ms-lbl">Milestones</div>
                <div className="pv-ms-row">
                  <div className="pv-ms-icon done">✓</div>
                  <span className="pv-ms-name done">CLI Foundation</span>
                  <span className="pv-pill done">Done</span>
                </div>
                <div className="pv-task-row">
                  <div className="pv-task-cb done">✓</div>
                  <span className="pv-task-txt done">Setup repository</span>
                </div>
                <div className="pv-task-row">
                  <div className="pv-task-cb done">✓</div>
                  <span className="pv-task-txt done">
                    Initialize CLI framework
                  </span>
                </div>
                <div className="pv-ms-row">
                  <div className="pv-ms-icon active">⚡</div>
                  <span className="pv-ms-name">Bug Detection Engine</span>
                  <span className="pv-pill boss">BOSS</span>
                </div>
                <div className="pv-task-row">
                  <div className="pv-task-cb done">✓</div>
                  <span className="pv-task-txt done">Code scanning</span>
                </div>
                <div className="pv-task-row">
                  <div className="pv-task-cb" />
                  <span className="pv-task-txt pulse">
                    Pattern detection...
                  </span>
                </div>
                <div className="pv-task-row">
                  <div className="pv-task-cb" />
                  <span
                    className="pv-task-txt"
                    style={{ color: "var(--text4)" }}
                  >
                    Error classification
                  </span>
                </div>
                <div className="pv-ms-row">
                  <div className="pv-ms-icon locked">🔒</div>
                  <span className="pv-ms-name locked">Patch Generator</span>
                  <span className="pv-pill locked">Locked</span>
                </div>
              </div>
              <div className="pv-right">
                <div className="pv-stat-card">
                  <div className="pv-stat-val p">{previewProgress}%</div>
                  <div className="pv-stat-lbl">progress</div>
                </div>
                <div className="pv-stat-card">
                  <div className="pv-stat-val a">6d</div>
                  <div className="pv-stat-lbl">streak</div>
                </div>
                <div className="pv-lb-head">Top Builders</div>
                <div className="pv-lb-row">
                  <div className="pv-lb-rank g">1</div>
                  <div className="pv-lb-av">RK</div>
                  <div className="pv-lb-name">Riya K.</div>
                  <div className="pv-lb-score">34</div>
                </div>
                <div className="pv-lb-row">
                  <div className="pv-lb-rank g">2</div>
                  <div className="pv-lb-av">DM</div>
                  <div className="pv-lb-name">Dev M.</div>
                  <div className="pv-lb-score">28</div>
                </div>
                <div className="pv-lb-row">
                  <div className="pv-lb-rank">3</div>
                  <div className="pv-lb-av">SK</div>
                  <div className="pv-lb-name">Sara K.</div>
                  <div className="pv-lb-score">21</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="social-proof">
        <div className="sp-inner">
          <span className="sp-label">Live builders</span>
          <div className="sp-divider" />
          <div className="sp-scroll">
            {liveBuilders.map((builder) => (
              <div key={builder.name} className="sp-builder">
                <div className="sp-av">{builder.initials}</div>
                <div>
                  <div className="sp-name">{builder.name}</div>
                  <div className="sp-proj">{builder.project}</div>
                </div>
                <div className="sp-score">{builder.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-full">
        <div className="section-full-inner reveal">
          <div className="section-eyebrow">The problem</div>
          <h2 className="section-h">
            Builders don&apos;t fail
            <br />
            because of bad ideas.
          </h2>
          <p className="section-sub">
            They fail because execution slowly fades. Momentum drops, clarity
            disappears, and the project gets abandoned.
          </p>
          <div className="problem-visual">
            <div className="problem-phase">
              <div className="problem-phase-day">Day 1</div>
              <div className="problem-phase-label">Excited about the idea</div>
              <div className="problem-phase-sub">
                Everything feels possible. Ready to build the thing.
              </div>
              <div className="problem-phase-bar">
                <div
                  className="problem-phase-fill"
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(90deg,var(--purple3),var(--purple2))",
                  }}
                />
              </div>
            </div>
            <div className="problem-phase">
              <div className="problem-phase-day">Week 2</div>
              <div className="problem-phase-label">Working inconsistently</div>
              <div className="problem-phase-sub">
                No clear plan. Not sure what to build next.
              </div>
              <div className="problem-phase-bar">
                <div
                  className="problem-phase-fill"
                  style={{ width: "42%", background: "var(--amber)" }}
                />
              </div>
            </div>
            <div className="problem-phase">
              <div className="problem-phase-day">Month 2</div>
              <div className="problem-phase-label">Project abandoned</div>
              <div className="problem-phase-sub">
                Momentum gone. Another idea sits unshipped.
              </div>
              <div className="problem-phase-bar">
                <div
                  className="problem-phase-fill"
                  style={{ width: "7%", background: "#ef4444" }}
                />
              </div>
            </div>
          </div>
          <div className="problem-resolution">
            <p>
              <strong>CroFlux fixes this</strong> by turning your product
              strategy into a structured execution system with milestones, daily
              tracking, and the momentum to keep shipping.
            </p>
          </div>
        </div>
      </div>
      <section className="section reveal" id="solution">
        <div className="section-eyebrow">The solution</div>
        <h2 className="section-h">
          A system designed to keep
          <br />
          builders <span className="purple">shipping.</span>
        </h2>
        <p className="section-sub">
          Three things work together to take you from idea to launch without
          losing momentum.
        </p>
        <div className="pillar-grid">
          <div className="pillar-card">
            <div className="pillar-icon">◈</div>
            <div className="pillar-title">AI Roadmap Generation</div>
            <p className="pillar-desc">
              Paste your product strategy. CroFlux generates a structured
              roadmap of 4–6 milestones with 3–5 actionable tasks each. Edit
              anything, it&apos;s your plan.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">◌</div>
            <div className="pillar-title">Progress Tracking</div>
            <p className="pillar-desc">
              Always know how close you are to launch. Progress is calculated
              automatically from completed tasks. One clear number that never
              lies.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">★</div>
            <div className="pillar-title">Builder Momentum</div>
            <p className="pillar-desc">
              Boss milestones, daily streaks, and a weekly leaderboard make
              execution feel like progress. Gamified motivation that actually
              works.
            </p>
          </div>
        </div>
      </section>
      <div className="section-full reveal" id="how">
        <div className="section-full-inner">
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-h">
            Watch the workflow.
            <br />
            From strategy to <span className="purple">execution.</span>
          </h2>
          <p className="section-sub" style={{ maxWidth: 760 }}>
            Click any tab to restart the workflow. CroFlux keeps looping through
            the product journey so builders can instantly understand how the
            system turns a PDS into shipped progress.
          </p>
          <div className="how-flow">
            <div
              className="how-flow-tabs how-flow-tabs-mobile"
              role="tablist"
              aria-label="CroFlux workflows"
            >
              {howWorkflows.map((workflow, index) => (
                <button
                  key={workflow.id}
                  type="button"
                  className={`how-flow-tab ${index === activeWorkflow ? "active" : ""}`}
                  onClick={() => {
                    if (workflowTransitionRef.current !== null) {
                      window.clearTimeout(workflowTransitionRef.current);
                    }

                    setWorkflowSceneVisible(false);
                    workflowTransitionRef.current = window.setTimeout(() => {
                      setActiveWorkflow(index);
                      setActiveWorkflowStep(0);
                      setWorkflowSceneVisible(true);
                      workflowTransitionRef.current = null;
                    }, 180);
                  }}
                >
                  <span className="how-flow-tab-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="how-flow-tab-title">{workflow.tab}</span>
                    <span className="how-flow-tab-caption">
                      {workflow.caption}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="how-flow-sidebar">
              <div className="how-flow-sidebar-head">
                <div className="how-flow-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="how-flow-sidebar-title">CroFlux Architect</div>
              </div>
              <div className="how-flow-prompt-title">
                {currentWorkflow.promptTitle}
              </div>
              <p className="how-flow-prompt-body">
                {currentWorkflow.promptBody}
              </p>
              <div className="how-flow-tags">
                {currentWorkflow.promptTags.map((tag) => (
                  <span key={tag} className="how-flow-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="how-flow-stage-list">
                {currentWorkflow.steps.map((step, index) => {
                  const state =
                    index < activeWorkflowStep
                      ? "done"
                      : index === activeWorkflowStep
                        ? "active"
                        : "idle";

                  return (
                    <div key={step.label} className={`how-flow-stage ${state}`}>
                      <div className="how-flow-stage-icon">
                        {state === "done" ? "✓" : index + 1}
                      </div>
                      <div>
                        <div className="how-flow-stage-label">{step.label}</div>
                        <div className="how-flow-stage-meta">
                          {step.metricLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="how-flow-main">
              <div
                className="how-flow-tabs"
                role="tablist"
                aria-label="CroFlux workflows"
              >
                {howWorkflows.map((workflow, index) => (
                  <button
                    key={workflow.id}
                    type="button"
                    className={`how-flow-tab ${index === activeWorkflow ? "active" : ""}`}
                    onClick={() => {
                      if (workflowTransitionRef.current !== null) {
                        window.clearTimeout(workflowTransitionRef.current);
                      }

                      setWorkflowSceneVisible(false);
                      workflowTransitionRef.current = window.setTimeout(() => {
                        setActiveWorkflow(index);
                        setActiveWorkflowStep(0);
                        setWorkflowSceneVisible(true);
                        workflowTransitionRef.current = null;
                      }, 180);
                    }}
                  >
                    <span className="how-flow-tab-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="how-flow-tab-title">{workflow.tab}</span>
                      <span className="how-flow-tab-caption">
                        {workflow.caption}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="how-flow-canvas">
                <div
                  className={`how-flow-scene ${workflowSceneVisible ? "is-visible" : "is-hidden"}`}
                >
                  <div className="how-flow-canvas-head">
                    <div>
                      <div className="how-flow-canvas-kicker">
                        {currentWorkflowStep.label}
                      </div>
                      <div className="how-flow-canvas-title">
                        {currentWorkflowStep.title}
                      </div>
                    </div>
                    <div className="how-flow-metric">
                      <span>{currentWorkflowStep.metricLabel}</span>
                      <strong>{currentWorkflowStep.metricValue}</strong>
                    </div>
                  </div>
                  <p className="how-flow-canvas-sub">
                    {currentWorkflowStep.subtitle}
                  </p>

                  {currentWorkflow.id === "roadmap" ? (
                    <div className="how-roadmap-board">
                      <div className="how-roadmap-column">
                        <div
                          className={`how-roadmap-card ${activeWorkflowStep >= 0 ? "active" : ""}`}
                        >
                          <div className="how-roadmap-card-head">
                            <span>Milestone 1</span>
                            <span>Done</span>
                          </div>
                          <div className="how-roadmap-card-title">
                            CLI Foundation
                          </div>
                          <div className="how-roadmap-task done">
                            Setup repository
                          </div>
                          <div className="how-roadmap-task done">
                            Initialize framework
                          </div>
                          <div className="how-roadmap-task done">
                            Ship first command
                          </div>
                        </div>
                        <div
                          className={`how-roadmap-card ${activeWorkflowStep >= 1 ? "active" : ""}`}
                        >
                          <div className="how-roadmap-card-head">
                            <span>Milestone 2</span>
                            <span>Active</span>
                          </div>
                          <div className="how-roadmap-card-title">
                            Bug Detection Engine
                          </div>
                          <div className="how-roadmap-task done">
                            Code scanning
                          </div>
                          <div
                            className={`how-roadmap-task ${activeWorkflowStep >= 2 ? "active" : ""}`}
                          >
                            Pattern detection
                          </div>
                          <div
                            className={`how-roadmap-task ${activeWorkflowStep >= 2 ? "active" : ""}`}
                          >
                            Error classification
                          </div>
                        </div>
                      </div>
                      <div className="how-roadmap-column">
                        <div
                          className={`how-boss-card ${activeWorkflowStep >= 3 ? "active" : ""}`}
                        >
                          <div className="how-boss-head">
                            <span>Boss milestone</span>
                            <span>BOSS</span>
                          </div>
                          <div className="how-boss-title">MVP Launch</div>
                          <div className="how-boss-bar">
                            <div
                              className="how-boss-bar-fill"
                              style={{
                                width: activeWorkflowStep >= 3 ? "72%" : "36%",
                              }}
                            />
                          </div>
                          <div className="how-boss-meta">
                            Complete milestone tasks to drain HP.
                          </div>
                        </div>
                        <div className="how-roadmap-summary">
                          <div>4 milestones generated</div>
                          <div>16 tasks drafted</div>
                          <div>2 boss milestones tagged</div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentWorkflow.id === "execution" ? (
                    <div className="how-execution-board">
                      <div className="how-execution-list">
                        <div
                          className={`how-execution-item ${activeWorkflowStep >= 0 ? "done" : ""}`}
                        >
                          <span>✓</span>
                          Finish landing page copy
                        </div>
                        <div
                          className={`how-execution-item ${activeWorkflowStep >= 0 ? "done" : ""}`}
                        >
                          <span>✓</span>
                          Wire Supabase auth
                        </div>
                        <div
                          className={`how-execution-item ${activeWorkflowStep >= 1 ? "done" : ""}`}
                        >
                          <span>✓</span>
                          Confirm roadmap
                        </div>
                        <div
                          className={`how-execution-item ${activeWorkflowStep >= 1 ? "done" : ""}`}
                        >
                          <span>✓</span>
                          Defeat CLI Foundation
                        </div>
                        <div
                          className={`how-execution-item ${activeWorkflowStep >= 2 ? "active" : ""}`}
                        >
                          <span>{activeWorkflowStep >= 2 ? "★" : "•"}</span>
                          Climb the weekly leaderboard
                        </div>
                      </div>
                      <div className="how-execution-stats">
                        <div className="how-execution-stat">
                          <span>Progress</span>
                          <strong>
                            {activeWorkflowStep === 0
                              ? "38%"
                              : activeWorkflowStep === 1
                                ? "64%"
                                : "81%"}
                          </strong>
                        </div>
                        <div className="how-execution-stat">
                          <span>Streak</span>
                          <strong>
                            {activeWorkflowStep === 0
                              ? "4d"
                              : activeWorkflowStep === 1
                                ? "6d"
                                : "8d"}
                          </strong>
                        </div>
                        <div className="how-execution-stat">
                          <span>Leaderboard</span>
                          <strong>
                            {activeWorkflowStep === 0
                              ? "#14"
                              : activeWorkflowStep === 1
                                ? "#10"
                                : "#8"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {currentWorkflow.id === "boss" ? (
                    <div className="how-launch-board">
                      <div className="how-launch-boss">
                        <div className="how-boss-head">
                          <span>MVP Launch Boss</span>
                          <span>
                            {activeWorkflowStep === 0
                              ? "HP 62%"
                              : activeWorkflowStep === 1
                                ? "HP 0%"
                                : "Defeated"}
                          </span>
                        </div>
                        <div className="how-boss-bar large">
                          <div
                            className="how-boss-bar-fill"
                            style={{
                              width:
                                activeWorkflowStep === 0
                                  ? "62%"
                                  : activeWorkflowStep === 1
                                    ? "12%"
                                    : "100%",
                            }}
                          />
                        </div>
                        <div className="how-launch-checks">
                          <div
                            className={activeWorkflowStep >= 0 ? "done" : ""}
                          >
                            QA checklist locked in
                          </div>
                          <div
                            className={activeWorkflowStep >= 1 ? "done" : ""}
                          >
                            Launch blocker resolved
                          </div>
                          <div
                            className={activeWorkflowStep >= 2 ? "done" : ""}
                          >
                            Product live to users
                          </div>
                        </div>
                      </div>
                      <div className="how-launch-side">
                        <div className="how-launch-card">
                          <span>Rank</span>
                          <strong>
                            {activeWorkflowStep === 0
                              ? "#7"
                              : activeWorkflowStep === 1
                                ? "#5"
                                : "#3"}
                          </strong>
                        </div>
                        <div className="how-launch-card">
                          <span>Status</span>
                          <strong>
                            {activeWorkflowStep === 2
                              ? "Launched"
                              : "Final push"}
                          </strong>
                        </div>
                        <div className="how-launch-card accent">
                          <span>Momentum</span>
                          <strong>
                            {activeWorkflowStep === 0
                              ? "+120"
                              : activeWorkflowStep === 1
                                ? "+240"
                                : "+400"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section reveal" id="features">
        <div className="section-eyebrow">Features</div>
        <h2 className="section-h">
          Everything a solo builder
          <br />
          <span className="purple">actually needs.</span>
        </h2>
        <div className="feat-grid">
          <div ref={featureProgressRef} className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">⚔</div>
              <span className="feat-badge amber">Gamification</span>
            </div>
            <div className="feat-title">Boss Milestones</div>
            <p className="feat-desc">
              Major milestones become boss battles. Complete tasks to drain the
              boss&apos;s HP. Defeat it to unlock the next stage.
            </p>
            <div className="feat-preview">
              <div className="boss-row">
                <span style={{ fontSize: 11, color: "var(--text2)", flex: 1 }}>
                  Launch MVP
                </span>
                <span className="boss-tag">BOSS</span>
              </div>
              <div className="boss-row">
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--amber)",
                    minWidth: 20,
                    fontFamily: "var(--mono)",
                  }}
                >
                  HP
                </span>
                <div className="boss-hp-track">
                  <div className="boss-hp-fill" />
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text3)",
                  fontFamily: "var(--mono)",
                }}
              >
                4/6 tasks completed
              </div>
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">★</div>
              <span className="feat-badge purple">Momentum</span>
            </div>
            <div className="feat-title">Builder Streak</div>
            <p className="feat-desc">
              Ship at least one task per day to keep your streak alive. Miss a
              day and it resets. Simple accountability that works.
            </p>
            <div className="feat-preview">
              <div className="streak-header">
                <span className="streak-fire">★</span>
                <span className="streak-count">6</span>
                <span className="streak-lbl">day streak</span>
              </div>
              <div className="streak-days">
                <div className="streak-day done">M</div>
                <div className="streak-day done">T</div>
                <div className="streak-day done">W</div>
                <div className="streak-day done">T</div>
                <div className="streak-day done">F</div>
                <div className="streak-day done">S</div>
                <div className="streak-day today">S</div>
              </div>
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">◈</div>
              <span className="feat-badge purple">AI-Powered</span>
            </div>
            <div className="feat-title">AI Roadmap Generator</div>
            <p className="feat-desc">
              Paste your product strategy. GPT converts it into 4–6 milestones
              with 3–5 actionable tasks each in seconds.
            </p>
            <div
              className="feat-preview"
              style={{
                fontSize: 11,
                fontFamily: "var(--mono)",
                lineHeight: 1.8,
                color: "var(--text3)",
              }}
            >
              <span style={{ color: "var(--purple2)" }}>→</span> CLI Foundation
              (4 tasks)
              <br />
              <span style={{ color: "var(--text2)" }}>→</span> Bug Detection (5
              tasks)
              <br />
              <span style={{ color: "var(--text4)" }}>→</span> Patch Generator
              (3 tasks)
              <br />
              <span style={{ color: "var(--text4)" }}>→</span> GitHub
              Integration (4 tasks)
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">◎</div>
              <span className="feat-badge amber">Competition</span>
            </div>
            <div className="feat-title">Weekly Leaderboard</div>
            <p className="feat-desc">
              Ranked by weekly tasks completed. Resets every Monday. Your rank
              updates live as you ship.
            </p>
            <div className="feat-preview">
              <div className="lb-mini-row">
                <div className="lb-mini-rank g">1</div>
                <div className="lb-mini-av">RK</div>
                <div className="lb-mini-name">Riya K.</div>
                <div className="lb-mini-score">34</div>
              </div>
              <div className="lb-mini-row">
                <div className="lb-mini-rank g">2</div>
                <div className="lb-mini-av">DM</div>
                <div className="lb-mini-name">Dev M.</div>
                <div className="lb-mini-score">28</div>
              </div>
              <div
                className="lb-mini-row"
                style={{
                  background: "var(--purple-dim)",
                  border: "1px solid var(--purple-mid)",
                  borderRadius: 4,
                  padding: "5px 4px",
                  margin: "2px -4px",
                }}
              >
                <div
                  className="lb-mini-rank"
                  style={{ color: "var(--purple2)" }}
                >
                  —
                </div>
                <div
                  className="lb-mini-av"
                  style={{
                    borderColor: "var(--purple)",
                    color: "var(--purple2)",
                  }}
                >
                  YO
                </div>
                <div
                  className="lb-mini-name"
                  style={{ color: "var(--purple2)" }}
                >
                  You
                </div>
                <div className="lb-mini-score">0</div>
              </div>
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">▓</div>
              <span className="feat-badge purple">Tracking</span>
            </div>
            <div className="feat-title">Progress Bar System</div>
            <p className="feat-desc">
              Progress calculated automatically: completed tasks / total tasks.
              Always know how close you are to launch.
            </p>
            <div className="feat-preview">
              <div className="prog-row">
                <span className="prog-lbl">Startup progress</span>
                <span className="prog-val">{featureProgress}%</span>
              </div>
              <div className="prog-track">
                <div
                  className="prog-fill"
                  style={{ width: `${featureProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon-row">
              <div className="feat-icon">⚡</div>
              <span className="feat-badge purple">Motivation</span>
            </div>
            <div className="feat-title">Completion Messages</div>
            <p className="feat-desc">
              Every completed task fires a motivational message. Random from a
              curated set — keeps energy high.
            </p>
            <div className="msg-preview">
              <div className="msg-head">Momentum unlocked</div>
              <div className="msg-body">
                You&apos;re 63% closer to launch. Keep shipping.
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="section-full reveal" id="for-builders">
        <div className="section-full-inner">
          <div className="section-eyebrow">Who it&apos;s for</div>
          <h2 className="section-h">
            Built for builders who
            <br />
            actually <span className="purple">ship.</span>
          </h2>
          <div className="for-grid">
            <div className="for-card">
              <div className="for-avatar">⚙</div>
              <div className="for-title">Indie Hackers</div>
              <p className="for-desc">
                Launching SaaS products solo. You need execution clarity, not
                another generic project manager.
              </p>
              <div className="for-tags">
                <div className="for-tag">Side projects → real products</div>
                <div className="for-tag">Ship fast, iterate faster</div>
              </div>
            </div>
            <div className="for-card">
              <div className="for-avatar">▲</div>
              <div className="for-title">Solo Founders</div>
              <p className="for-desc">
                Building your startup alone. You need a system that keeps you
                accountable and on track every single day.
              </p>
              <div className="for-tags">
                <div className="for-tag">Pre-seed or self-funded</div>
                <div className="for-tag">Idea → launch solo</div>
              </div>
            </div>
            <div className="for-card">
              <div className="for-avatar">◆</div>
              <div className="for-title">Student Builders</div>
              <p className="for-desc">
                Working on side projects from a dorm room. You have the energy —
                this gives you the structure to ship.
              </p>
              <div className="for-tags">
                <div className="for-tag">First startup experience</div>
                <div className="for-tag">Compete with peers</div>
              </div>
            </div>
            <div className="for-card">
              <div className="for-avatar">□</div>
              <div className="for-title">Developers</div>
              <p className="for-desc">
                Shipping tools and apps. Stop hacking in circles — turn your
                technical skills into a real product.
              </p>
              <div className="for-tags">
                <div className="for-tag">SaaS &amp; AI tools</div>
                <div className="for-tag">Product discipline</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lb-section-bg reveal">
        <div className="lb-section-inner">
          <div>
            <div className="section-eyebrow">Leaderboard</div>
            <h2 className="section-h">
              The most active
              <br />
              builders this <span className="purple">week.</span>
            </h2>
            <div className="lb-table">
              <div className="lb-th">
                <div className="lb-th-lbl">Rank</div>
                <div className="lb-th-lbl">Builder</div>
                <div className="lb-th-lbl">Tasks</div>
                <div className="lb-th-lbl">Streak</div>
              </div>
              <div className="lb-tr">
                <div className="lb-rank g">1</div>
                <div className="lb-builder">
                  <div className="lb-av">RK</div>
                  <div>
                    <div className="lb-bname">Riya K.</div>
                    <div className="lb-bproj">Noteship</div>
                  </div>
                </div>
                <div className="lb-tasks">34</div>
                <div className="lb-streak">★ 12d</div>
              </div>
              <div className="lb-tr">
                <div className="lb-rank g">2</div>
                <div className="lb-builder">
                  <div className="lb-av">DM</div>
                  <div>
                    <div className="lb-bname">Dev M.</div>
                    <div className="lb-bproj">APIFlow</div>
                  </div>
                </div>
                <div className="lb-tasks">28</div>
                <div className="lb-streak">★ 8d</div>
              </div>
              <div className="lb-tr">
                <div className="lb-rank">3</div>
                <div className="lb-builder">
                  <div className="lb-av">SK</div>
                  <div>
                    <div className="lb-bname">Sara K.</div>
                    <div className="lb-bproj">Formify</div>
                  </div>
                </div>
                <div className="lb-tasks">21</div>
                <div className="lb-streak">★ 5d</div>
              </div>
              <div className="lb-tr">
                <div className="lb-rank">4</div>
                <div className="lb-builder">
                  <div className="lb-av">JL</div>
                  <div>
                    <div className="lb-bname">Jay L.</div>
                    <div className="lb-bproj">Stackr</div>
                  </div>
                </div>
                <div className="lb-tasks">17</div>
                <div className="lb-streak">★ 3d</div>
              </div>
              <div className="lb-tr you">
                <div className="lb-rank" style={{ color: "var(--purple2)" }}>
                  —
                </div>
                <div className="lb-builder">
                  <div className="lb-av you">YO</div>
                  <div>
                    <div className="lb-bname you">You (not on it yet)</div>
                    <div className="lb-bproj">Your startup</div>
                  </div>
                </div>
                <div className="lb-tasks">0</div>
                <div className="lb-streak" style={{ color: "var(--text3)" }}>
                  —
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div className="lb-right-stat">
              <div className="lb-right-val p">247</div>
              <div className="lb-right-lbl">
                builders competing this week. Weekly leaderboard resets every
                Monday. Your rank updates live as you ship.
              </div>
            </div>
            <div className="lb-right-stat">
              <div className="lb-right-val a">92%</div>
              <div className="lb-right-lbl">
                daily retention among builders who compete on the leaderboard.
                Competition is the best accountability system.
              </div>
            </div>
            <div className="lb-right-stat">
              <div className="lb-right-val">4.2k</div>
              <div className="lb-right-lbl">
                boss milestones defeated across all builders. Every defeat
                unlocks the next stage of your startup.
              </div>
            </div>
          </div>
        </div>
      </div>
      <section
        className="section reveal"
        id="pricing"
        style={{ textAlign: "center" }}
      >
        <div className="section-eyebrow" style={{ justifyContent: "center" }}>
          Pricing
        </div>
        <h2 className="section-h">
          Free for <span className="purple">early builders.</span>
        </h2>
        <p className="section-sub" style={{ margin: "0 auto" }}>
          CroFlux is free during early access. Pricing will be introduced after
          launch.
        </p>
        <p
          style={{
            margin: "18px auto 0",
            color: "var(--text3)",
            fontSize: 13,
          }}
        >
          Built in public. Early users shape the product.
        </p>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-badge-tag">Limited early access</div>
            <div className="price-head">
              <div style={{ height: 14 }} aria-hidden="true" />
              <div className="price-amount">$0</div>
              <div className="price-period">Free during beta</div>
            </div>
            <ul className="price-feats">
              <li className="price-feat">1 startup project</li>
              <li className="price-feat">AI roadmap generation</li>
              <li className="price-feat">Task management</li>
              <li className="price-feat">Progress tracking</li>
              <li className="price-feat">Builder streak</li>
              <li className="price-feat">Weekly leaderboard</li>
              <li className="price-feat no">Boss milestone battles</li>
              <li className="price-feat no">Multiple projects</li>
            </ul>
            <div
              className="price-priority-note"
              style={{
                marginTop: 14,
                color: "var(--purple2)",
                borderColor: "var(--purple-border)",
                background:
                  "linear-gradient(180deg, var(--accent-subtle), color-mix(in srgb, var(--accent) 6%, transparent))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "999px",
                  background: "var(--purple2)",
                  boxShadow: "0 0 14px var(--accent-muted)",
                  flexShrink: 0,
                }}
              />
              Limited to first 20 builders
            </div>
            <Link href={waitlistHref} className="btn-plan-ghost">
              Get early access →
            </Link>
          </div>
          <div className="price-card featured">
            <div className="price-head price-head-featured">
              <div
                className="price-amount price-amount-featured"
                style={{ color: "var(--purple2)" }}
              >
                Coming soon
              </div>
              <div className="price-period">Planned pricing after launch</div>
            </div>
            <div className="price-priority-note">
              Access opens after early builder spots are filled.
            </div>
            <ul className="price-feats">
              <li className="price-feat">Unlimited projects</li>
              <li className="price-feat">AI roadmap generation</li>
              <li className="price-feat">Task management</li>
              <li className="price-feat">Progress tracking</li>
              <li className="price-feat">Builder streak</li>
              <li className="price-feat">Weekly leaderboard</li>
              <li className="price-feat">Boss milestone battles</li>
              <li className="price-feat">Activity analytics</li>
              <li className="price-feat">Advanced features (coming soon)</li>
            </ul>
            <Link href={waitlistHref} className="btn-plan-primary">
              Join waitlist →
            </Link>
          </div>
        </div>
      </section>
      <section className="ecosystem-section reveal" aria-labelledby="ecosystem-title">
        <div className="ecosystem-shell">
          <div className="section-eyebrow ecosystem-eyebrow">Ecosystem</div>
          <h2 className="section-h ecosystem-title" id="ecosystem-title">
            Part of the <span className="purple">Croovi suite.</span>
          </h2>
          <p className="section-sub ecosystem-sub">
            CroFlux sits inside a connected set of tools built for how solo
            founders actually plan, execute, automate, and observe their work.
          </p>

          <div className="ecosystem-parent-row">
            <div className="ecosystem-card ecosystem-card-parent">
              <div className="ecosystem-logo-wrap ecosystem-logo-wrap-croovi">
                <Image
                  src="/brand/ecosystem/croovi-symbol.png"
                  alt="Croovi"
                  width={120}
                  height={120}
                  className="ecosystem-logo ecosystem-logo-croovi"
                />
              </div>
              <div className="ecosystem-label ecosystem-label-croovi">Platform layer</div>
              <div className="ecosystem-name">Croovi</div>
              <p className="ecosystem-desc">
                The operating layer for planning, product context, and decision flow.
              </p>
            </div>
          </div>

          <div className="ecosystem-connector" aria-hidden="true">
            <div className="ecosystem-connector-stem" />
            <div className="ecosystem-connector-rail" />
          </div>

          <div className="ecosystem-grid">
            <article className="ecosystem-card ecosystem-card-croflux">
              <div className="ecosystem-badge">You&apos;re here</div>
              <div className="ecosystem-logo-wrap ecosystem-logo-wrap-croflux">
                <Image
                  src="/brand/ecosystem/croflux-nb-1.png"
                  alt="CroFlux"
                  width={32}
                  height={32}
                  className="ecosystem-logo ecosystem-logo-croflux"
                />
              </div>
              <div className="ecosystem-label ecosystem-label-croflux">Project &amp; execution</div>
              <div className="ecosystem-name">CroFlux</div>
              <p className="ecosystem-desc">
                Turns strategy into structured work, with projects, tasks, ownership, and execution flow.
              </p>
            </article>

            <article className="ecosystem-card ecosystem-card-crofx">
              <div className="ecosystem-logo-wrap ecosystem-logo-wrap-crofx">
                <Image
                  src="/brand/ecosystem/croofx-nb.png"
                  alt="CrooFx"
                  width={32}
                  height={32}
                  className="ecosystem-logo ecosystem-logo-crofx"
                />
              </div>
              <div className="ecosystem-label ecosystem-label-crofx">AI automation</div>
              <div className="ecosystem-name">CroFx</div>
              <p className="ecosystem-desc">
                Automates repetitive dev workflows so your team moves faster with less overhead.
              </p>
            </article>

            <article className="ecosystem-card ecosystem-card-crovew">
              <div className="ecosystem-logo-wrap ecosystem-logo-wrap-crovew">
                <Image
                  src="/brand/ecosystem/crovew-logo-cropped.png"
                  alt="CroVew"
                  width={124}
                  height={80}
                  className="ecosystem-logo ecosystem-logo-crovew"
                />
              </div>
              <div className="ecosystem-label ecosystem-label-crovew">Visibility</div>
              <div className="ecosystem-name">CroVew</div>
              <p className="ecosystem-desc">
                Real-time behavioral analytics. See who&apos;s live, what they&apos;re doing, and where they drop off.
              </p>
              <Link
                href="https://crovew.vercel.app/"
                className="ecosystem-visit"
                target="_blank"
                rel="noreferrer"
              >
                Visit ↗
              </Link>
            </article>
          </div>
        </div>
        <style jsx>{`
          .ecosystem-section {
            position: relative;
            overflow: hidden;
            padding: 24px 40px 88px;
            border-top: 1px solid var(--border);
          }

          .ecosystem-section::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 50% 8%, rgba(61, 232, 212, 0.08) 0%, transparent 36%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.015) 0%, transparent 62%);
            pointer-events: none;
          }

          .ecosystem-shell {
            position: relative;
            z-index: 1;
            width: min(100%, 1120px);
            margin: 0 auto;
          }

          .ecosystem-eyebrow {
            justify-content: center;
            color: #51e7d7;
          }

          .ecosystem-title {
            text-align: center;
          }

          .ecosystem-sub {
            max-width: 640px;
            margin: 0 auto 52px;
            text-align: center;
          }

          .ecosystem-parent-row {
            display: flex;
            justify-content: center;
          }

          .ecosystem-grid {
            position: relative;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .ecosystem-card {
            position: relative;
            min-height: 286px;
            padding: 30px 28px 24px;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background:
              linear-gradient(180deg, rgba(14, 16, 24, 0.96), rgba(11, 13, 19, 0.98)),
              radial-gradient(circle at top, rgba(255, 255, 255, 0.02), transparent 56%);
            text-align: center;
            transition:
              transform 0.22s ease,
              border-color 0.22s ease,
              box-shadow 0.22s ease;
          }

          .ecosystem-card:hover {
            transform: translateY(-2px);
          }

          .ecosystem-card-parent {
            width: min(100%, 352px);
            min-height: 238px;
            margin-bottom: 24px;
            border-color: rgba(61, 232, 212, 0.14);
          }

          .ecosystem-card-parent:hover {
            border-color: rgba(61, 232, 212, 0.26);
            box-shadow: 0 0 0 1px rgba(61, 232, 212, 0.08);
          }

          .ecosystem-card-croflux {
            border-color: color-mix(in srgb, var(--accent) 20%, rgba(255, 255, 255, 0.08));
          }

          .ecosystem-card-croflux:hover {
            border-color: color-mix(in srgb, var(--accent) 42%, transparent);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent);
          }

          .ecosystem-card-crofx:hover {
            border-color: color-mix(in srgb, var(--amber) 36%, transparent);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--amber) 10%, transparent);
          }

          .ecosystem-card-crovew {
            border-color: rgba(61, 232, 212, 0.18);
          }

          .ecosystem-card-crovew:hover {
            border-color: rgba(61, 232, 212, 0.34);
            box-shadow: 0 0 0 1px rgba(61, 232, 212, 0.1);
          }

          .ecosystem-icon,
          .ecosystem-logo-wrap {
            margin: 0 auto 18px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ecosystem-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
          }

          .ecosystem-icon-croovi,
          .ecosystem-icon-croflux {
            background: color-mix(in srgb, var(--accent) 10%, transparent);
          }

          .ecosystem-icon-crofx {
            background: color-mix(in srgb, var(--amber) 11%, transparent);
          }

          .ecosystem-icon-crovew {
            background: rgba(61, 232, 212, 0.08);
          }

          .ecosystem-mark {
            width: 22px;
            height: auto;
          }

          .ecosystem-logo-wrap {
            background: transparent;
          }

          .ecosystem-logo-wrap-croovi {
            width: 32px;
            height: 32px;
          }

          .ecosystem-logo-wrap-croflux {
            width: 32px;
            height: 32px;
          }

          .ecosystem-logo-wrap-crofx {
            width: 32px;
            height: 32px;
          }

          .ecosystem-logo-wrap-crovew {
            width: 32px;
            height: 32px;
          }

          .ecosystem-logo {
            width: 100%;
            height: 100%;
            object-fit: contain;
            mix-blend-mode: screen;
            filter:
              brightness(1.06)
              contrast(1.04)
              drop-shadow(0 0 18px rgba(124, 110, 247, 0.08));
          }

          .ecosystem-logo-crofx {
            mix-blend-mode: screen;
            filter:
              brightness(1.08)
              contrast(1.14)
              saturate(1.06)
              drop-shadow(0 0 12px rgba(245, 158, 11, 0.16));
          }

          .ecosystem-logo-croflux {
            transform: scale(1.22);
            transform-origin: center;
          }

          .ecosystem-logo-crovew {
            filter:
              brightness(1.04)
              contrast(1.08)
              saturate(1.04)
              drop-shadow(0 0 14px rgba(61, 232, 212, 0.16));
          }

          .ecosystem-label {
            margin-bottom: 8px;
            font-family: var(--mono);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          .ecosystem-label-croovi {
            color: #8f84ff;
          }

          .ecosystem-label-croflux {
            color: #a58cff;
          }

          .ecosystem-label-crofx {
            color: #f6b546;
          }

          .ecosystem-label-crovew {
            color: #51e7d7;
          }

          .ecosystem-name {
            margin-bottom: 10px;
            font-size: 19px;
            font-weight: 600;
            letter-spacing: -0.02em;
            color: var(--text);
          }

          .ecosystem-desc {
            max-width: 292px;
            margin: 0 auto;
            font-size: 15px;
            line-height: 1.62;
            color: var(--text2);
          }

          .ecosystem-connector {
            position: relative;
            height: 46px;
            width: min(100%, 920px);
            margin: 0 auto -2px;
          }

          .ecosystem-connector::before,
          .ecosystem-connector::after {
            content: "";
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(61, 232, 212, 0.3);
            border-radius: 999px;
          }

          .ecosystem-connector::before {
            top: 0;
            width: 5px;
            height: 5px;
          }

          .ecosystem-connector::after {
            top: 22px;
            width: 4px;
            height: 4px;
            opacity: 0.5;
          }

          .ecosystem-connector-stem {
            position: absolute;
            top: 0;
            left: 50%;
            width: 1px;
            height: 24px;
            transform: translateX(-50%);
            background: linear-gradient(180deg, rgba(61, 232, 212, 0.48), rgba(61, 232, 212, 0.14));
          }

          .ecosystem-connector-rail {
            position: absolute;
            left: 50%;
            bottom: 16px;
            width: calc(100% - 160px);
            height: 1px;
            transform: translateX(-50%);
            background: linear-gradient(90deg, transparent, rgba(61, 232, 212, 0.18) 12%, rgba(61, 232, 212, 0.18) 88%, transparent);
          }

          .ecosystem-grid::before,
          .ecosystem-grid::after {
            content: "";
            position: absolute;
            top: -30px;
            width: 1px;
            height: 30px;
            background: linear-gradient(180deg, rgba(61, 232, 212, 0.38), rgba(61, 232, 212, 0.08));
          }

          .ecosystem-grid::before {
            left: 16.666%;
          }

          .ecosystem-grid::after {
            left: 83.333%;
          }

          .ecosystem-badge {
            position: absolute;
            top: -11px;
            right: 16px;
            padding: 5px 12px;
            border-radius: 999px;
            background: #51e7d7;
            color: #071513;
            font-family: var(--mono);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .ecosystem-visit {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 18px;
            min-width: 94px;
            height: 34px;
            padding: 0 14px;
            border-radius: 8px;
            border: 1px solid rgba(61, 232, 212, 0.16);
            background: rgba(12, 24, 26, 0.56);
            color: #9cefe5;
            font-family: var(--mono);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            transition:
              color 0.2s ease,
              border-color 0.2s ease,
              background-color 0.2s ease,
              transform 0.2s ease;
          }

          .ecosystem-card-crovew:hover .ecosystem-visit {
            color: #e8fffb;
            border-color: rgba(61, 232, 212, 0.34);
            background: rgba(12, 31, 30, 0.72);
            transform: translateY(-1px);
          }

          @media (max-width: 980px) {
            .ecosystem-grid {
              grid-template-columns: 1fr;
            }

            .ecosystem-card,
            .ecosystem-card-parent {
              width: 100%;
              min-height: auto;
            }

            .ecosystem-connector,
            .ecosystem-grid::before,
            .ecosystem-grid::after {
              display: none;
            }
          }

          @media (max-width: 640px) {
            .ecosystem-section {
              padding: 16px 20px 72px;
            }

            .ecosystem-card {
              padding: 24px 20px 22px;
            }

            .ecosystem-sub {
              margin-bottom: 40px;
            }

            .ecosystem-badge {
              right: 12px;
            }
          }
        `}</style>
      </section>
      <div className="cta-section" id="waitlist">
        <div className="cta-bg-word">BUILD</div>
        <div className="cta-inner reveal">
          <h2 className="cta-h">
            Your next milestone
            <br />
            is <span className="cta-accent">waiting.</span>
          </h2>
          <p className="cta-sub">
            Join 247 builders shipping daily. Generate your roadmap in 90
            seconds. Your startup deserves a progress engine.
          </p>
          <div className="waitlist-panel">
            <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                value={waitlistEmail}
                onChange={(event) => {
                  setWaitlistEmail(event.target.value);
                  if (waitlistState !== "idle") {
                    setWaitlistState("idle");
                    setWaitlistMessage("");
                  }
                }}
                placeholder="Enter your work email"
                className="waitlist-input"
                aria-label="Email address"
                autoComplete="email"
              />
              <button
                type="submit"
                className="btn-primary waitlist-submit"
                disabled={waitlistState === "loading"}
              >
                {waitlistState === "loading" ? "Joining..." : "Join Waitlist →"}
              </button>
            </form>
            <div className={`waitlist-feedback ${waitlistState}`}>
              {waitlistMessage ||
                "Get early access before public signups open. Company and professional emails are welcome."}
            </div>
          </div>
          <div className="cta-actions">
            <div className="cta-live">
              <div className="cta-live-dot" />
              <span>{ctaMsgs[ctaIndex]}</span>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <Logo
                href="/"
                className="footer-logo"
                markClassName="footer-logo-mark"
              />
              <p className="footer-desc">
                The startup execution platform for solo builders. From idea to
                launch with full clarity.
              </p>
              <p style={{ fontSize: 12, color: "var(--text4)" }}>
                Made for builders, by builders.
              </p>
            </div>
            <div>
              <div className="footer-col-head">Product</div>
              <Link href="#how" className="footer-link">
                How it works
              </Link>
              <Link href="#features" className="footer-link">
                Features
              </Link>
              <Link href="#pricing" className="footer-link">
                Pricing
              </Link>
            </div>
            <div>
              <div className="footer-col-head">Community</div>
              <Link
                href="https://discord.com/invite/6j37AVAcSH"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </Link>
              <Link
                href="https://x.com/CrooviOfficial"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                Twitter / X
              </Link>
              <Link
                href="https://github.com/croovi-org"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
            </div>
            <div>
              <div className="footer-col-head">Company</div>
              <Link href="/" className="footer-link">
                Contact
              </Link>
              <Link href="/" className="footer-link">
                Privacy
              </Link>
              <Link href="/" className="footer-link">
                Terms
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">
              © 2025 CroFlux. All rights reserved.
            </div>
            <div className="footer-socials">
              <Link
                href="https://x.com/CrooviOfficial"
                className="footer-social"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </Link>
              <Link
                href="https://github.com/croovi-org"
                className="footer-social"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
              <Link
                href="https://discord.com/invite/6j37AVAcSH"
                className="footer-social"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
