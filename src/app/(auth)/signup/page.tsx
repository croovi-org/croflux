"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthSidePanel } from "@/components/shared/auth-side-panel";
import { Logo } from "@/components/shared/logo";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignup() {
    setError("");
    setLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user?.id) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        name: "",
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/onboarding");
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1240px] flex-col gap-6 rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-4 md:p-6 lg:grid lg:grid-cols-[minmax(0,520px)_1fr] lg:p-8">
        <section className="flex min-h-full flex-col rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg)] p-6 md:p-8">
          <div className="mb-10 flex items-center justify-between">
            <Logo />
            <Link
              href="/"
              className="text-[13px] text-[var(--text3)] hover:text-[var(--text)]"
            >
              Back home
            </Link>
          </div>

          <div className="my-auto">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
              Sign up
            </p>
            <h1 className="mt-4 text-[40px] font-semibold tracking-[-0.04em] text-[var(--text)]">
              Create account
            </h1>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius)] border border-[var(--border2)] bg-[var(--bg3)] text-[14px] font-medium text-[var(--text)] hover:border-[var(--border3)] hover:bg-[var(--bg4)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text4)]">
                or
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[13px] text-[var(--text2)]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 w-full rounded-[var(--radius)] bg-[var(--bg3)] px-4 text-[14px]"
                  placeholder="you@startup.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-[var(--text2)]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  className="h-12 w-full rounded-[var(--radius)] bg-[var(--bg3)] px-4 text-[14px]"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-[var(--text2)]">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  className="h-12 w-full rounded-[var(--radius)] bg-[var(--bg3)] px-4 text-[14px]"
                  placeholder="Confirm your password"
                />
              </div>

              {error ? (
                <p className="rounded-[var(--radius)] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[13px] text-[#fda4af]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius)] bg-[var(--purple)] text-[14px] font-medium text-white hover:bg-[var(--purple3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>

            <p className="mt-6 text-[14px] text-[var(--text3)]">
              Already building?{" "}
              <Link href="/login" className="text-[var(--purple2)] hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <AuthSidePanel />
      </div>
    </main>
  );
}
