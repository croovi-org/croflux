"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function CurrentPlanCard() {
  const router = useRouter();

  return (
    <section className="section-card">
      <div className="plan-head">
        <div className="plan-copy">
          <div className="plan-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h2>Early Access — Free</h2>
            <p>Beta access for early builders shaping CroFlux with us.</p>
          </div>
        </div>
        <div className="price">$0 / month</div>
      </div>

      <div className="features-box">
        <ul>
          <li>Full dashboard workspace access</li>
          <li>Roadmap and boss milestone progression</li>
          <li>Priority product feedback loop</li>
          <li>Early integrations and launch updates</li>
        </ul>
      </div>

      <button
        type="button"
        className="pricing-btn"
        onClick={() => router.push("/pricing")}
      >
        View pricing plans
      </button>

      <style jsx>{`
        .section-card {
          background: #13131e;
          border: 1px solid #252538;
          border-radius: 18px;
          padding: 26px 28px 30px;
        }
        .plan-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 22px;
        }
        .plan-copy {
          display: flex;
          gap: 22px;
          min-width: 0;
        }
        .plan-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          color: #7c6ef7;
          background: rgba(124, 110, 247, 0.08);
          border: 1px solid rgba(124, 110, 247, 0.24);
          flex-shrink: 0;
        }
        .plan-icon :global(svg) {
          width: 24px;
          height: 24px;
        }
        h2 {
          margin: 0 0 8px;
          font-size: 26px;
          font-weight: 600;
          color: #f0f0f8;
          line-height: 1.05;
        }
        p {
          margin: 0;
          font-size: 16px;
          line-height: 1.45;
          color: #747a95;
        }
        .price {
          padding-top: 4px;
          font-size: 22px;
          font-family: "Geist Mono", monospace;
          color: #f0f0f8;
          white-space: nowrap;
          line-height: 1.1;
        }
        .features-box {
          border: 1px solid #252538;
          border-radius: 18px;
          background: #1a1a28;
          padding: 24px 30px;
          margin-bottom: 26px;
        }
        ul {
          margin: 0;
          padding-left: 32px;
          display: grid;
          gap: 18px;
          color: #8a8fa8;
          font-size: 16px;
          line-height: 1.35;
        }
        .pricing-btn {
          width: 100%;
          height: 72px;
          border-radius: 18px;
          border: 1px solid rgba(124, 110, 247, 0.24);
          background: rgba(124, 110, 247, 0.08);
          color: #7c6ef7;
          font-size: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          cursor: pointer;
          white-space: nowrap;
          appearance: none;
          transform: translateY(0);
          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            border-color 0.16s ease,
            background 0.16s ease,
            color 0.16s ease;
        }
        .pricing-btn:hover {
          transform: translateY(-2px);
          background: rgba(124, 110, 247, 0.12);
          border-color: rgba(124, 110, 247, 0.34);
          color: #9186ff;
          box-shadow:
            0 12px 26px rgba(8, 8, 14, 0.18),
            0 0 20px -8px rgba(124, 110, 247, 0.65);
        }
        @media (max-width: 900px) {
          .section-card {
            padding: 20px;
          }
          .plan-head {
            flex-direction: column;
            gap: 16px;
          }
          .plan-copy {
            gap: 16px;
          }
          .plan-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
          }
          .plan-icon :global(svg) {
            width: 20px;
            height: 20px;
          }
          h2 {
            font-size: 22px;
          }
          p,
          ul {
            font-size: 15px;
          }
          .features-box {
            padding: 18px 20px;
            border-radius: 16px;
          }
          .pricing-btn {
            height: 60px;
            border-radius: 16px;
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
