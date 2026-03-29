import { ReachItem } from "@/components/contact/ReachItem";

const expectationItems = [
  "We read every message personally",
  "Response within 24 hours on weekdays",
  "No sales pitch — just a real conversation",
];

export function ContactSidebar() {
  return (
    <aside className="space-y-4">
      <section className="rounded-[16px] border border-[#1e1e28] bg-[#111117] p-6">
        <h3 className="text-[17px] font-semibold text-white">Need something custom?</h3>
        <p className="mt-2 text-[13px] leading-6 text-[#52525b]">
          Talk to us about larger teams, custom onboarding, or an early enterprise setup.
        </p>
      </section>

      <section className="rounded-[16px] border border-[#1e1e28] bg-[#111117] p-6">
        <div className="mb-4 text-[13px] font-medium tracking-[0.8px] text-[#52525b] uppercase">
          Other ways to reach us
        </div>
        <div className="space-y-3">
          <ReachItem
            icon="📧"
            label="Email"
            value="support@croflux.ai"
            href="mailto:support@croflux.ai"
          />
          <ReachItem
            icon="𝕏"
            label="Twitter / X"
            value="@CroFlux"
            href="https://twitter.com/CroFlux"
          />
        </div>
      </section>

      <section className="rounded-[16px] border border-[#1e1e28] bg-[#111117] p-6">
        <div className="mb-4 text-[13px] font-medium tracking-[0.8px] text-[#52525b] uppercase">
          What to expect
        </div>
        <div className="space-y-3">
          {expectationItems.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#7c6af7]" />
              <p className="text-[13px] leading-6 text-[#71717a]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
