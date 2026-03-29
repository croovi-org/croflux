"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_THEME_ID, isThemeId, type Theme } from "@/lib/themes";

const STORAGE_KEY = "croflux-theme";

type ThemeContextValue = {
  theme: Theme["id"];
  setTheme: (id: Theme["id"]) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(themeId: Theme["id"]) {
  document.documentElement.setAttribute("data-theme", themeId);
  window.localStorage.setItem(STORAGE_KEY, themeId);
}

function getStoredTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeId(stored) ? stored : DEFAULT_THEME_ID;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme["id"]>(() => getStoredTheme());
  const userIdRef = useRef<string | null>(null);

  const syncThemeToSupabase = useCallback(async (themeId: Theme["id"]) => {
    if (!userIdRef.current) return;

    const supabase = createClient();
    await supabase
      .from("users")
      .update({ theme_preference: themeId })
      .eq("id", userIdRef.current);
  }, []);

  const setTheme = useCallback(
    async (themeId: Theme["id"]) => {
      setThemeState(themeId);
      applyTheme(themeId);
      await syncThemeToSupabase(themeId);
    },
    [syncThemeToSupabase],
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const supabase = createClient();

    async function loadThemePreference() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      userIdRef.current = user?.id ?? null;

      if (!user) {
        const storedTheme = getStoredTheme();
        setThemeState(storedTheme);
        applyTheme(storedTheme);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("theme_preference")
        .eq("id", user.id)
        .maybeSingle();

      if (error) return;

      const nextTheme = isThemeId(data?.theme_preference)
        ? data.theme_preference
        : getStoredTheme();

      setThemeState(nextTheme);
      applyTheme(nextTheme);
    }

    loadThemePreference();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      userIdRef.current = session?.user?.id ?? null;

      if (!session?.user) {
        const storedTheme = getStoredTheme();
        setThemeState(storedTheme);
        applyTheme(storedTheme);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("theme_preference")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) return;

      const nextTheme = isThemeId(data?.theme_preference)
        ? data.theme_preference
        : getStoredTheme();

      setThemeState(nextTheme);
      applyTheme(nextTheme);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
