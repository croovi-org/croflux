import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
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
      { error: "You’re already registered on the waitlist." },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You’re already registered on the waitlist." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to save your waitlist request right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Congratulations! You’ll be notified when CroFlux goes live.",
  });
}
