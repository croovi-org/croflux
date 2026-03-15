const testimonials = [
  {
    quote:
      "I went from idea to first user in 18 days. The boss milestone system kept me honest.",
    author: "Riya K.",
    project: "built Noteship",
  },
  {
    quote:
      "Finally a tool that tracks startup progress, not just tasks. The leaderboard keeps me shipping every day.",
    author: "Dev M.",
    project: "built APIFlow",
  },
  {
    quote:
      "Generated my entire roadmap in 30 seconds. Edited 2 tasks and started building immediately.",
    author: "Sara K.",
    project: "built Formify",
  },
];

export function SocialProof() {
  return (
    <section className="mx-auto max-w-[1140px] px-5 py-20 md:px-10 md:py-24">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
          Builders shipping with CroFlux
        </p>
        <h2 className="mt-4 text-[clamp(30px,5vw,46px)] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--text)]">
          Builders shipping with CroFlux
        </h2>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.author}
            className="rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg2)] p-8 hover:bg-[var(--bg3)]"
          >
            <p className="text-[48px] font-semibold leading-none tracking-[-0.05em] text-[var(--purple-mid)]">
              “
            </p>
            <p className="mt-3 text-[15px] leading-8 text-[var(--text2)]">
              {testimonial.quote}
            </p>
            <footer className="mt-6 border-t border-[var(--border)] pt-4">
              <p className="text-[13px] font-medium text-[var(--purple2)]">
                {testimonial.author}
              </p>
              <p className="mt-1 text-[11px] text-[var(--text3)]">
                {testimonial.project}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
