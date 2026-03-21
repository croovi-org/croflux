import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const publicOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || "",
      });

      return NextResponse.redirect(`${publicOrigin}/onboarding`);
    }
  }

  return NextResponse.redirect(`${publicOrigin}/login`);
}
