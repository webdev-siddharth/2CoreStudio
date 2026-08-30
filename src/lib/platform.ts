export type DetectedPlatform = "windows" | "mac" | "android" | "ios" | "web" | "linux";

/**
 * Client-side platform detection. Matches the visitor against the
 * app_platforms `platform` values; falls back to "web".
 */
export function detectPlatform(
  userAgent: string = typeof navigator !== "undefined" ? navigator.userAgent : ""
): DetectedPlatform {
  const ua = userAgent.toLowerCase();

  const has = (needle: string) => ua.includes(needle);
  const uaData = (navigator as { userAgentData?: { platform?: string } })
    .userAgentData?.platform?.toLowerCase();

  if (has("android")) return "android";
  if (has("iphone") || has("ipod")) return "ios";
  // iPadOS 13+ reports as macOS — touch + Macintosh = iPad
  if (has("ipad") || (has("macintosh") && navigator.maxTouchPoints > 1))
    return "ios";
  if (has("windows") || uaData?.includes("win")) return "windows";
  if (has("macintosh") || uaData === "macos") return "mac";
  return "web";
}

export const PLATFORM_LABELS: Record<DetectedPlatform, string> = {
  windows: "Windows",
  mac: "macOS",
  android: "Android",
  ios: "iOS",
  web: "Web",
  linux: "Linux",
};
