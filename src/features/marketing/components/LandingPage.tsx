"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

export function LandingPage() {
  const [taskCount, setTaskCount] = useState(1284);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(20);
  const [featureProgress, setFeatureProgress] = useState(20);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const featureProgressRef = useRef<HTMLDivElement | null>(null);

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
      setPreviewProgress(getScrollProgress(previewRef.current, 20, 50));
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

  const tickerItems = [...tickerMsgs, ...tickerMsgs];

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
          <Link href="/login" className="nav-login">
            Log in
          </Link>
          <Link href="/signup" className="nav-cta">
            Start Building →
          </Link>
        </div>
      </nav>

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
        <div className="hero-shell">
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
              Track your startup
              <br />
              from idea to <span className="gradient">launch.</span>
            </h1>
            <p className="hero-sub">
              Turn your Product Development Strategy into milestones, tasks, and
              real progress. Ship daily. Beat the bosses. Climb the board.
            </p>
            <div className="hero-btns">
              <Link href="/signup" className="btn-primary">
                Start Building with CroFlux →
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
            Three steps.
            <br />
            From idea to <span className="purple">execution.</span>
          </h2>
          <div className="how-grid">
            <div className="how-step">
              <div className="how-step-num">Step 01</div>
              <div className="how-step-title">Describe your startup</div>
              <p className="how-step-desc">
                Paste your product development strategy in plain language. No
                special format — just describe how you&apos;re going to build it.
              </p>
              <div className="how-step-example">
                <span className="hl">→</span> Build AI debugging CLI
                <br />
                <span className="hl">→</span> Detect bugs in code
                <br />
                <span className="hl">→</span> Generate patch suggestions
                <br />
                <span className="hl">→</span> GitHub integration
                <br />
                <span className="hl">→</span> Launch beta
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-num">Step 02</div>
              <div className="how-step-title">CroFlux builds your roadmap</div>
              <p className="how-step-desc">
                AI converts your strategy into structured milestones and tasks in
                seconds. Edit, add, or remove anything. Fully in your control.
              </p>
              <div className="how-step-example">
                <span className="hl">Milestone 1</span> · CLI Foundation
                <br />
                <span style={{ color: "var(--text4)" }}>— Setup repository</span>
                <br />
                <span style={{ color: "var(--text4)" }}>— Initialize framework</span>
                <br />
                <br />
                <span className="hl">Milestone 2</span> · Bug Detection
                <br />
                <span style={{ color: "var(--text4)" }}>— Code scanning</span>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-num">Step 03</div>
              <div className="how-step-title">Execute and track progress</div>
              <p className="how-step-desc">
                Your dashboard tracks every task. Progress updates live. Boss
                milestones challenge you. Streaks keep you consistent.
              </p>
              <div className="how-step-example">
                <span className="hl">Progress</span> ████████░░░░ 45%
                <br />
                <span className="hl">Streak</span> ★ 6 day streak
                <br />
                <span className="hl">Rank</span> #12 this week
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

      <section className="section reveal">
        <div className="section-eyebrow">From builders</div>
        <h2 className="section-h">
          They shipped.
          <br />
          You <span className="purple">can too.</span>
        </h2>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-quote">&quot;</div>
            <p className="testi-text">
              I went from idea to first user in 18 days. The boss milestone
              system kept me honest when I wanted to skip steps. Nothing else
              gave me this kind of clarity.
            </p>
          </div>
          <div className="testi-card">
            <div className="testi-quote">&quot;</div>
            <p className="testi-text">
              The streak system is ruthless. Miss one day and you feel it. That
              pressure is exactly what I needed. I shipped more in 3 weeks than
              in 3 months before.
            </p>
          </div>
          <div className="testi-card">
            <div className="testi-quote">&quot;</div>
            <p className="testi-text">
              I&apos;m a student founder with no team. The AI roadmap gave me a
              plan in seconds. I knew exactly what to build next every single
              day. Complete game changer.
            </p>
          </div>
        </div>
      </section>

      <div className="section-full reveal">
        <div className="section-full-inner">
          <div className="section-eyebrow">Why CroFlux</div>
          <h2 className="section-h">
            Not another
            <br />
            task manager.
          </h2>
          <p className="section-sub">
            Every other tool tracks tasks. CroFlux tracks startup execution —
            the real distance between where you are and where you&apos;re
            launching.
          </p>
          <div className="compare-grid">
            <div className="compare-card">
              <div className="compare-tool">Notion</div>
              <div className="compare-type">notes &amp; docs</div>
            </div>
            <div className="compare-card">
              <div className="compare-tool">Trello</div>
              <div className="compare-type">task boards</div>
            </div>
            <div className="compare-card">
              <div className="compare-tool">ClickUp</div>
              <div className="compare-type">project management</div>
            </div>
            <div className="compare-card hl">
              <div className="compare-tool p">CroFlux</div>
              <div className="compare-type p">startup execution</div>
            </div>
          </div>
        </div>
      </div>

      <section className="section reveal" id="pricing" style={{ textAlign: "center" }}>
        <div className="section-eyebrow" style={{ justifyContent: "center" }}>
          Pricing
        </div>
        <h2 className="section-h">
          Simple. <span className="purple">Honest.</span>
        </h2>
        <p className="section-sub" style={{ margin: "0 auto" }}>
          Start free. Upgrade when you need more. No hidden fees, no surprise
          charges.
        </p>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-tier">Free</div>
            <div className="price-amount">$0</div>
            <div className="price-period">Forever free · No credit card</div>
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
            <Link href="/signup" className="btn-plan-ghost">
              Get started free
            </Link>
          </div>
          <div className="price-card featured">
            <div className="price-badge-tag">Most popular</div>
            <div className="price-tier">Builder</div>
            <div className="price-amount" style={{ color: "var(--purple2)" }}>
              $9
            </div>
            <div className="price-period">Per month · Cancel anytime</div>
            <ul className="price-feats">
              <li className="price-feat">Unlimited projects</li>
              <li className="price-feat">AI roadmap generation</li>
              <li className="price-feat">Task management</li>
              <li className="price-feat">Progress tracking</li>
              <li className="price-feat">Builder streak</li>
              <li className="price-feat">Weekly leaderboard</li>
              <li className="price-feat">Boss milestone battles</li>
              <li className="price-feat">Activity analytics</li>
            </ul>
            <Link href="/signup" className="btn-plan-primary">
              Start building →
            </Link>
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-bg-word">SHIP</div>
        <div className="cta-inner reveal">
          <h2 className="cta-h">
            Stop planning.
            <br />
            <span className="gradient">Start shipping.</span>
          </h2>
          <p className="cta-sub">
            Turn your startup idea into an execution roadmap. Join 247 builders
            shipping daily.
          </p>
          <div className="cta-actions">
            <Link href="/signup" className="btn-primary" style={{ fontSize: 15, padding: "13px 32px" }}>
              Start Building with CroFlux →
            </Link>
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
