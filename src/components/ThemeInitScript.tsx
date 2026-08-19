import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Inline script in <head> — applies the stored/system theme before first
 * paint so the page never flashes the wrong mode.
 */
export function ThemeInitScript() {
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )});if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":${JSON.stringify(
    DEFAULT_THEME
  )};}var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
    DEFAULT_THEME
  )});}})();`;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
