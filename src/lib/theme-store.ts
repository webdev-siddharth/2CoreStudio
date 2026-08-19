"use client";

import { DEFAULT_THEME, THEME_STORAGE_KEY, type ThemeName } from "@/lib/theme";

let current: ThemeName = DEFAULT_THEME;
let initialized = false;
const listeners = new Set<() => void>();

function applyTheme(theme: ThemeName) {
  const changed = !initialized || current !== theme;
  current = theme;
  initialized = true;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  if (changed) listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ThemeName {
  return current;
}

export function getServerSnapshot(): ThemeName {
  return DEFAULT_THEME;
}

export function setTheme(theme: ThemeName) {
  applyTheme(theme);
}

export function toggleTheme() {
  applyTheme(current === "dark" ? "light" : "dark");
}

export function syncThemeFromDom(): ThemeName {
  let resolved: ThemeName;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    resolved =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : DEFAULT_THEME;
  } catch {
    resolved = DEFAULT_THEME;
  }
  applyTheme(resolved);
  return resolved;
}
