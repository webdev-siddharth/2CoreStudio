"use client";

import type { ThemeName } from "@/lib/theme";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  syncThemeFromDom,
  toggleTheme as toggleStoredTheme,
} from "@/lib/theme-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type ThemeContextValue = {
  theme: ThemeName;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render both use the server snapshot
  // (DEFAULT_THEME), so hydration always matches. After hydration the store
  // is synced from the DOM/localStorage (pre-paint ThemeInitScript already
  // set data-theme, so there's no flash).
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    syncThemeFromDom();
  }, []);

  const toggleTheme = useCallback(() => toggleStoredTheme(), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
