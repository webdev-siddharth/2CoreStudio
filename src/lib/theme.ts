/**
 * 2coreStudio theme tokens — single source of truth for both modes.
 * Mirrors the CSS custom properties in globals.css.
 */
export const themes = {
  dark: {
    background: "#232321",
    surface: "#292929",
    surface2: "#333333",
    primary: "#FFD23F",
    secondary: "#3155D9",
    text: "#F5F1E8",
    mutedText: "#C5C0B7",
    ink: "#0A0A0A",
  },
  light: {
    background: "#FFF9E8",
    surface: "#FFFFFF",
    surface2: "#F2EEDC",
    primary: "#FFD23F",
    secondary: "#3155D9",
    text: "#151515",
    mutedText: "#595959",
    ink: "#151515",
  },
} as const;

export type ThemeName = keyof typeof themes;

export const DEFAULT_THEME: ThemeName = "dark";

export const THEME_STORAGE_KEY = "2core-theme";
