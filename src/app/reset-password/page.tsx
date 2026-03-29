"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { AuthSidePanel } from "@/features/auth/components/AuthSidePanel";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const initialError = searchParams.get("error_description");
  const decodedInitialError = initialError
    ? decodeURIComponent(initialError.replace(/\+/g, " "))
    : "";

  useEffect(() => {
    let active = true;

    async function bootstrapRecoverySession() {
      const nextError = decodedInitialError;

      if (nextError) {
        if (active) {
          setError(nextError);
          setSessionReady(false);
        }
        return;
      }

      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);

      const code = search.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hashError = hashParams.get("error_description");

      if (hashError) {
        if (active) {
          setError(decodeURIComponent(hashError.replace(/\+/g, " ")));
          setSessionReady(false);
        }
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!active) return;

        if (exchangeError) {
          setError(exchangeError.message);
          setSessionReady(false);
          return;
        }

        window.history.replaceState({}, "", "/reset-password");
        setSessionReady(true);
        return;
      }

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
          setSessionReady(false);
          return;
        }

        window.history.replaceState({}, "", "/reset-password");
        setSessionReady(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session) {
        setSessionReady(true);
        return;
      }

      setError("Reset link is invalid or has expired. Request a new one.");
      setSessionReady(false);
    }

    void bootstrapRecoverySession();

    return () => {
      active = false;
    };
  }, [decodedInitialError, supabase.auth]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!sessionReady) {
      setError("Your reset session is not ready yet. Open the latest reset link and try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setNotice("Password updated. Redirecting you back to login...");
    window.setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1240px] flex-col gap-6 rounded-[20px] border border-[var(--border)] bg-[var(--bg2)] p-4 md:p-6 lg:grid lg:grid-cols-[minmax(0,520px)_1fr] lg:p-8">
        <section className="flex min-h-full flex-col rounded-[var(--radius2)] border border-[var(--border)] bg-[var(--bg)] p-6 md:p-8">
          <div className="mb-10 flex items-center justify-between">
            <Logo />
            <Link
              href="/login"
              className="text-[13px] text-[var(--text3)] hover:text-[var(--text)]"
            >
              Back to login
            </Link>
          </div>

          <div className="my-auto">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--purple2)]">
              Recovery
            </p>
            <h1 className="mt-4 text-[40px] font-semibold tracking-[-0.04em] text-[var(--text)]">
              Set a new password
            </h1>
            <p className="mt-4 max-w-[460px] text-[15px] leading-7 text-[var(--text2)]">
              Choose a fresh password for your CroFlux account. Once saved, you
              can jump back into your workspace.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[13px] text-[var(--text2)]">
                  New password
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
                  Confirm new password
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

              {error || decodedInitialError ? (
                <p className="rounded-[var(--radius)] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-[13px] text-[#fda4af]">
                  {error || decodedInitialError}
                </p>
              ) : null}

              {notice ? (
                <p className="rounded-[var(--radius)] border border-[var(--accent-muted)] bg-[var(--accent-subtle)] px-4 py-3 text-[13px] text-[var(--purple2)]">
                  {notice}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading || !sessionReady}
                className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius)] bg-[var(--purple)] text-[14px] font-medium text-white hover:bg-[var(--purple3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : sessionReady
                    ? "Update password →"
                    : "Waiting for reset link..."}
              </button>
            </form>
          </div>
        </section>

        <AuthSidePanel />
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
