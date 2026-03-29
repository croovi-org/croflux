import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const subject = body?.subject?.trim();
  const message = body?.message?.trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Please fill out every field." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (name.length > 120 || email.length > 254 || subject.length > 120 || message.length > 5000) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Contact email is not configured right now. Please try again shortly." },
      { status: 500 },
    );
  }

  const inbox = process.env.CONTACT_TO_EMAIL || "support@croflux.ai";
  const from = process.env.CONTACT_FROM_EMAIL || "CroFlux <contact@croovi.com>";

  try {
    await resend.emails.send({
      from,
      to: inbox,
      replyTo: email,
      subject: `CroFlux contact: ${subject}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#0d0d0f; color:#e4e4e7; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#111117; border:1px solid #1e1e28; border-radius:16px; padding:24px;">
            <p style="margin:0 0 16px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#7c6af7;">New contact message</p>
            <h2 style="margin:0 0 16px; font-size:24px; color:#ffffff;">${escapeHtml(subject)}</h2>
            <div style="display:grid; gap:8px; margin-bottom:20px; color:#a1a1aa; font-size:14px;">
              <div><strong style="color:#ffffff;">Name:</strong> ${escapeHtml(name)}</div>
              <div><strong style="color:#ffffff;">Email:</strong> ${escapeHtml(email)}</div>
              <div><strong style="color:#ffffff;">Topic:</strong> ${escapeHtml(subject)}</div>
            </div>
            <div style="padding:16px; border:1px solid #2a2a35; border-radius:12px; background:#0d0d0f; color:#d4d4dd; white-space:pre-wrap; line-height:1.7;">${escapeHtml(message)}</div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Message sent" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
