"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    const supabase = createClient();

    // Run signout calls without blocking redirect - use Promise.allSettled with timeout
    const signOutWithTimeout = Promise.race([
      Promise.allSettled([
        supabase.auth.signOut({ scope: "global" }),
        fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin",
        }),
      ]),
      new Promise((resolve) => setTimeout(resolve, 3000)), // 3 second timeout
    ]);

    // Always redirect after attempting signout, don't block on result
    signOutWithTimeout.finally(() => {
      window.location.href = "/login";
    });
  }, [isSigningOut]);

  return { signOut, isSigningOut };
}
