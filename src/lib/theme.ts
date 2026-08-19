/**
 * 2coreStudio theme tokens — single source of truth for both modes.
 * Mirrors the CSS custom properties in globals.css.
 */
export const themes = {
  dark: {
    bg: "#1A1428",
    surface: "#241B38",
    surface2: "#2D2244",
    ink: "#EDE6F5",
    magenta: "#FF4FA0",
    orange: "#FFA05C",
    muted: "#B3A4CC",
  },
  light: {
    bg: "#F0E9F7",
    surface: "#FFFFFF",
    surface2: "#F7F0FC",
    ink: "#241B38",
    magenta: "#D81B72",
    orange: "#D9720E",
    muted: "#7A6B92",
  },
} as const;

export type ThemeName = keyof typeof themes;

export const DEFAULT_THEME: ThemeName = "dark";

export const THEME_STORAGE_KEY = "2core-theme";
