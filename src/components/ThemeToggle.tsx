"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surface2 hover:text-magenta active:translate-x-1 active:translate-y-1 active:shadow-none ${className}`}
    >
      {theme === "dark" ? "☾ dark" : "☀ light"}
    </button>
  );
}