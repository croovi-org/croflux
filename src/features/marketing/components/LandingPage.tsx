"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

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
        subtitle: "4 launch phases are drafted in the right sequence for the builder.",
        metricLabel: "Milestones drafted",
        metricValue: "4/4",
      },
      {
        label: "Expanding tasks",
        title: "Tasks are attached to each milestone",
        subtitle: "Every phase gets focused actions instead of vague planning notes.",
        metricLabel: "Tasks generated",
        metricValue: "16",
      },
      {
        label: "Assigning bosses",
        title: "Major phases become boss milestones",
        subtitle: "CroFlux turns critical launch stages into boss battles to keep momentum high.",
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
        subtitle: "Daily work turns into visible progress instead of staying buried in a to-do list.",
        metricLabel: "Tasks shipped today",
        metricValue: "5",
      },
      {
        label: "Closing milestones",
        title: "Milestones close as work stacks up",
        subtitle: "Completed tasks roll into milestone completion and unlock the next stage.",
        metricLabel: "Milestone progress",
        metricValue: "75%",
      },
      {
        label: "Earning momentum",
        title: "Builders gain points, streaks, and rank",
        subtitle: "Each completion feeds streaks, leaderboard movement, and momentum messages.",
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
        subtitle: "CroFlux frames the hard phase as a visible challenge instead of a boring checklist.",
        metricLabel: "Boss HP",
        metricValue: "62%",
      },
      {
        label: "Defeating the boss",
        title: "The milestone is defeated and launch unlocks",
        subtitle: "One last push clears the blocker and opens the final launch checklist.",
        metricLabel: "Boss defeated",
        metricValue: "Unlocked",
      },
      {
        label: "Shipping the product",
        title: "The builder launches and climbs ahead",
        subtitle: "Product launched. Rank improves. Momentum spills into the next build cycle.",
        metricLabel: "Launch status",
        metricValue: "Live",
      },
    ],
  },
] as const;

export function LandingPage() {
  const [taskCount, setTaskCount] = useState(1284);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [heroEntered, setHeroEntered] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [featureProgress, setFeatureProgress] = useState(20);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [workflowSceneVisible, setWorkflowSceneVisible] = useState(true);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const featureProgressRef = useRef<HTMLDivElement | null>(null);
  const workflowTransitionRef = useRef<number | null>(null);

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
    const getScrollProgress = (element: HTMLDivElement | null, min: number, max: number) => {
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

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setWaitlistState("error");
        setWaitlistMessage(payload.error ?? "Unable to join the waitlist right now.");
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
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12L7 2L12 12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 9H10.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          CroFlux
        </Link>
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
          <Link href={waitlistHref} className="nav-login">
            Waitlist
          </Link>
          <Link href={waitlistHref} className="nav-cta">
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
                  gap: 8,
                  padding: "4px 8px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: "var(--purple)",
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 12L7 2L12 12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9H10.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                  CroFlux
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
                <div className="pv-fill" style={{ width: `${previewProgress}%` }} />
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
                <span className="pv-task-txt done">Initialize CLI framework</span>
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
                <span className="pv-task-txt pulse">Pattern detection...</span>
              </div>
              <div className="pv-task-row">
                <div className="pv-task-cb" />
                <span className="pv-task-txt" style={{ color: "var(--text4)" }}>
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
            the product journey so builders can instantly understand how the system
            turns a PDS into shipped progress.
          </p>
          <div className="how-flow">
            <div className="how-flow-sidebar">
              <div className="how-flow-sidebar-head">
                <div className="how-flow-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="how-flow-sidebar-title">CroFlux Architect</div>
              </div>
              <div className="how-flow-prompt-title">{currentWorkflow.promptTitle}</div>
              <p className="how-flow-prompt-body">{currentWorkflow.promptBody}</p>
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
                        <div className="how-flow-stage-meta">{step.metricLabel}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="how-flow-main">
              <div className="how-flow-tabs" role="tablist" aria-label="CroFlux workflows">
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
                    <span className="how-flow-tab-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="how-flow-tab-title">{workflow.tab}</span>
                      <span className="how-flow-tab-caption">{workflow.caption}</span>
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
                      <div className="how-flow-canvas-kicker">{currentWorkflowStep.label}</div>
                      <div className="how-flow-canvas-title">{currentWorkflowStep.title}</div>
                    </div>
                    <div className="how-flow-metric">
                      <span>{currentWorkflowStep.metricLabel}</span>
                      <strong>{currentWorkflowStep.metricValue}</strong>
                    </div>
                  </div>
                  <p className="how-flow-canvas-sub">{currentWorkflowStep.subtitle}</p>

                  {currentWorkflow.id === "roadmap" ? (
                    <div className="how-roadmap-board">
                      <div className="how-roadmap-column">
                        <div className={`how-roadmap-card ${activeWorkflowStep >= 0 ? "active" : ""}`}>
                          <div className="how-roadmap-card-head">
                            <span>Milestone 1</span>
                            <span>Done</span>
                          </div>
                          <div className="how-roadmap-card-title">CLI Foundation</div>
                          <div className="how-roadmap-task done">Setup repository</div>
                          <div className="how-roadmap-task done">Initialize framework</div>
                          <div className="how-roadmap-task done">Ship first command</div>
                        </div>
                        <div className={`how-roadmap-card ${activeWorkflowStep >= 1 ? "active" : ""}`}>
                          <div className="how-roadmap-card-head">
                            <span>Milestone 2</span>
                            <span>Active</span>
                          </div>
                          <div className="how-roadmap-card-title">Bug Detection Engine</div>
                          <div className="how-roadmap-task done">Code scanning</div>
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
                        <div className={`how-boss-card ${activeWorkflowStep >= 3 ? "active" : ""}`}>
                          <div className="how-boss-head">
                            <span>Boss milestone</span>
                            <span>BOSS</span>
                          </div>
                          <div className="how-boss-title">MVP Launch</div>
                          <div className="how-boss-bar">
                            <div
                              className="how-boss-bar-fill"
                              style={{ width: activeWorkflowStep >= 3 ? "72%" : "36%" }}
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
                        <div className={`how-execution-item ${activeWorkflowStep >= 0 ? "done" : ""}`}>
                          <span>✓</span>
                          Finish landing page copy
                        </div>
                        <div className={`how-execution-item ${activeWorkflowStep >= 0 ? "done" : ""}`}>
                          <span>✓</span>
                          Wire Supabase auth
                        </div>
                        <div className={`how-execution-item ${activeWorkflowStep >= 1 ? "done" : ""}`}>
                          <span>✓</span>
                          Confirm roadmap
                        </div>
                        <div className={`how-execution-item ${activeWorkflowStep >= 1 ? "done" : ""}`}>
                          <span>✓</span>
                          Defeat CLI Foundation
                        </div>
                        <div className={`how-execution-item ${activeWorkflowStep >= 2 ? "active" : ""}`}>
                          <span>{activeWorkflowStep >= 2 ? "★" : "•"}</span>
                          Climb the weekly leaderboard
                        </div>
                      </div>
                      <div className="how-execution-stats">
                        <div className="how-execution-stat">
                          <span>Progress</span>
                          <strong>
                            {activeWorkflowStep === 0 ? "38%" : activeWorkflowStep === 1 ? "64%" : "81%"}
                          </strong>
                        </div>
                        <div className="how-execution-stat">
                          <span>Streak</span>
                          <strong>
                            {activeWorkflowStep === 0 ? "4d" : activeWorkflowStep === 1 ? "6d" : "8d"}
                          </strong>
                        </div>
                        <div className="how-execution-stat">
                          <span>Leaderboard</span>
                          <strong>
                            {activeWorkflowStep === 0 ? "#14" : activeWorkflowStep === 1 ? "#10" : "#8"}
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
                          <div className={activeWorkflowStep >= 0 ? "done" : ""}>QA checklist locked in</div>
                          <div className={activeWorkflowStep >= 1 ? "done" : ""}>Launch blocker resolved</div>
                          <div className={activeWorkflowStep >= 2 ? "done" : ""}>Product live to users</div>
                        </div>
                      </div>
                      <div className="how-launch-side">
                        <div className="how-launch-card">
                          <span>Rank</span>
                          <strong>
                            {activeWorkflowStep === 0 ? "#7" : activeWorkflowStep === 1 ? "#5" : "#3"}
                          </strong>
                        </div>
                        <div className="how-launch-card">
                          <span>Status</span>
                          <strong>{activeWorkflowStep === 2 ? "Launched" : "Final push"}</strong>
                        </div>
                        <div className="how-launch-card accent">
                          <span>Momentum</span>
                          <strong>
                            {activeWorkflowStep === 0 ? "+120" : activeWorkflowStep === 1 ? "+240" : "+400"}
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
                <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
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
              <div className="feat-preview" style={{ fontSize: 11, fontFamily: "var(--mono)", lineHeight: 1.8, color: "var(--text3)" }}>
                <span style={{ color: "var(--purple2)" }}>→</span> CLI Foundation (4 tasks)
                <br />
                <span style={{ color: "var(--text2)" }}>→</span> Bug Detection (5 tasks)
                <br />
                <span style={{ color: "var(--text4)" }}>→</span> Patch Generator (3 tasks)
                <br />
                <span style={{ color: "var(--text4)" }}>→</span> GitHub Integration (4 tasks)
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
                  <div className="lb-mini-rank" style={{ color: "var(--purple2)" }}>
                    —
                  </div>
                  <div
                    className="lb-mini-av"
                    style={{ borderColor: "var(--purple)", color: "var(--purple2)" }}
                  >
                    YO
                  </div>
                  <div className="lb-mini-name" style={{ color: "var(--purple2)" }}>
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
                  <div className="prog-fill" style={{ width: `${featureProgress}%` }} />
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

      <section className="section reveal" id="pricing" style={{ textAlign: "center" }}>
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
            <div className="price-tier">Early Access</div>
            <div className="price-amount">$0</div>
            <div className="price-period">Free during beta</div>
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
            <Link href={waitlistHref} className="btn-plan-ghost">
              Get early access →
            </Link>
          </div>
          <div className="price-card featured">
            <div className="price-badge-tag">Limited early access</div>
            <div className="price-tier">Builder</div>
            <div className="price-amount" style={{ color: "var(--purple2)" }}>
              Coming soon
            </div>
            <div className="price-period">Planned pricing after launch</div>
            <div
              style={{
                marginTop: 10,
                marginBottom: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 999,
                background: "rgba(124, 111, 247, 0.06)",
                border: "1px solid rgba(124, 111, 247, 0.14)",
                color: "var(--text3)",
                fontSize: 11,
                fontFamily: "var(--mono)",
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "999px",
                  background: "var(--purple2)",
                  flexShrink: 0,
                }}
              />
              First 20 builders get priority access
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
              <div className="footer-logo">
                <div className="footer-logo-mark">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 12L7 2L12 12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9H10.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                CroFlux
              </div>
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
              <Link href="/" className="footer-link">
                Changelog
              </Link>
              <Link href="/" className="footer-link">
                Docs
              </Link>
            </div>
            <div>
              <div className="footer-col-head">Community</div>
              <Link href="/" className="footer-link">
                Top builders
              </Link>
              <Link href="/" className="footer-link">
                Builder stories
              </Link>
              <Link href="/" className="footer-link">
                Discord
              </Link>
              <Link href="/" className="footer-link">
                Twitter / X
              </Link>
              <Link href="/" className="footer-link">
                GitHub
              </Link>
            </div>
            <div>
              <div className="footer-col-head">Company</div>
              <Link href="/" className="footer-link">
                About
              </Link>
              <Link href="/" className="footer-link">
                Blog
              </Link>
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
            <div className="footer-copy">© 2025 CroFlux. All rights reserved.</div>
            <div className="footer-socials">
              <Link href="/" className="footer-social">
                Twitter
              </Link>
              <Link href="/" className="footer-social">
                GitHub
              </Link>
              <Link href="/" className="footer-social">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
