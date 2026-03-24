import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data: existingEntry, error: lookupError } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Unable to verify your waitlist request right now." },
      { status: 500 },
    );
  }

  if (existingEntry) {
    return NextResponse.json(
      { error: "You're already registered on the waitlist." },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You're already registered on the waitlist." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Unable to save your waitlist request right now." },
      { status: 500 },
    );
  }

  // Send emails — fire and forget, don't block the response
  await Promise.allSettled([
    resend.emails.send({
      from: "CroFlux <waitlist@croovi.com>",
      to: email,
      subject: "You're on the CroFlux waitlist 🚀",
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4ade80; margin-bottom: 16px;">Hey, thank you for signing up! 🚀</h2>
          <p style="color: #ccc; line-height: 1.8;">
            You're now on the CroFlux early access waitlist.
          </p>
          <p style="color: #ccc; line-height: 1.8;">
            We're building CroFlux for builders who start a lot but struggle to consistently ship. 
            Paste your idea, get a structured roadmap of milestones and tasks, 
            and actually execute — with streaks, leaderboards, and boss battles 
            keeping you accountable every single day.
          </p>
          <p style="color: #ccc; line-height: 1.8;">
            The MVP is actively being built. You'll be among the first to know 
            when early access opens, and your feedback will directly shape what 
            CroFlux becomes.
          </p>
          <p style="color: #ccc; line-height: 1.8;">
            Until then, reply to this email or find me on X at 
            <a href="https://x.com/TheAshrex" style="color: #4ade80;">@TheAshrex</a>.
          </p>
          <div style="border-top: 1px solid #222; margin-top: 32px; padding-top: 24px;">
            <p style="color: #888; font-size: 13px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Also building under Croovi</p>
            <p style="color: #ccc; line-height: 1.8; margin-bottom: 8px;">
              🛡️ <strong style="color: #fff;">CrooFx</strong> — Sits between your AI tooling and CI/CD pipeline, blocking unsafe patches before they reach production. →
              <a href="https://croovi.com" style="color: #4ade80;">Join the waitlist</a>
            </p>
            <p style="color: #ccc; line-height: 1.8;">
              👁️ <strong style="color: #fff;">CroVew</strong> — Real-time behavioral analytics for SaaS founders. Drop in a script tag, see who's active, what they're doing, and where they're dropping off — in under 5 minutes.
              <span style="color: #555;">Waitlist coming soon.</span>
            </p>
          </div>
          <p style="color: #666; margin-top: 32px; font-size: 13px; border-top: 1px solid #222; padding-top: 16px;">
            — Ashish Khanagwal, Founder @<a href="https://x.com/CrooviOfficial" style="color: #4ade80; text-decoration: none;">Croovi</a>
          </p>
        </div>
      `,
    }),
    resend.emails.send({
      from: "CroFlux <waitlist@croovi.com>",
      to: "ashishkhanagwal2001@gmail.com",
      subject: "New CroFlux waitlist signup",
      html: `<p>New signup: <strong>${email}</strong></p>`,
    }),
  ]);

  return NextResponse.json({
    message: "Congratulations! You'll be notified when CroFlux goes live.",
  });
}
