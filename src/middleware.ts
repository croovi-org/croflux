import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const isCalendarOAuthBridgeRoute =
    pathname.startsWith("/auth/calendar-success") ||
    pathname.startsWith("/auth/calendar-error") ||
    pathname.startsWith("/api/auth/google-calendar/callback");

  if (
    !user &&
    !isCalendarOAuthBridgeRoute &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/my-tasks") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/leaderboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/pricing"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
