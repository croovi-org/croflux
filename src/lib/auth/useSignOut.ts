"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const supabase = createClient();

      await Promise.all([
        supabase.auth.signOut({ scope: "global" }),
        fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin",
        }),
      ]);

      window.location.href = "/login";
    } catch {
      setIsSigningOut(false);
    }
  }, [isSigningOut]);

  return { signOut, isSigningOut };
}
