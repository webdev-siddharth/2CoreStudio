import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";

export type PlatformKey =
  | "web"
  | "windows"
  | "macos"
  | "android"
  | "ios"
  | "linux";

export type SupportSection =
  | "account"
  | "troubleshooting"
  | "transparency"
  | "community";

export interface TopicLink {
  label: string;
  href: string;
}

export interface SupportTopic {
  id: string;
  section: SupportSection;
  title: string;
  blurb: string;
  bullets: string[];
  /** Empty array = general topic, shown under every platform filter. */
  platforms: PlatformKey[];
  links?: TopicLink[];
  lastReviewed: string;
}

export const SECTION_LABELS: Record<
  SupportSection,
  { kicker: string; title: string }
> = {
  account: {
    kicker: "Accounts & money",
    title: "Account & subscriptions",
  },
  troubleshooting: {
    kicker: "Fix it",
    title: "Troubleshooting & downloads",
  },
  transparency: {
    kicker: "Transparency",
    title: "Status & changelog",
  },
  community: {
    kicker: "Escalate",
    title: "Talk to us",
  },
};

export const SECTION_ORDER: SupportSection[] = [
  "account",
  "troubleshooting",
  "transparency",
  "community",
];

export const CONTACT_EMAIL = LEGAL_CONTACT_EMAIL;
export const SECURITY_EMAIL = "security@2corestudio.com";

export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: "cross-platform-syncing",
    section: "account",
    title: "Cross-platform syncing",
    blurb:
      "Run the same app on several devices and keep your data in step everywhere.",
    bullets: [
      "Install the app on each device and sign in to the same account",
      "Changes sync while the app is open and online",
      "Conflicts keep the newest edit and log the rest, so nothing is silently lost",
    ],
    platforms: ["web", "windows", "macos", "android", "ios", "linux"],
    links: [{ label: "Open your profile", href: "/profile" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "billing-purchases",
    section: "account",
    title: "Billing & purchases",
    blurb:
      "Restore purchases, manage store subscriptions and update payment methods.",
    bullets: [
      "iOS and Android purchases restore from the store receipt — no extra charge",
      "Subscriptions are managed in App Store / Google Play settings, not inside the app",
      "Web purchases live in your account; update payment details at the store",
    ],
    platforms: ["ios", "android", "web"],
    links: [{ label: "Open your profile", href: "/profile" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "account-recovery",
    section: "account",
    title: "Account recovery",
    blurb:
      "Self-service for forgotten passwords, changed emails and locked accounts.",
    bullets: [
      "Reset via the magic link on the profile page — no password resets needed",
      "Changed your email? Update it in profile or sign in with the new address",
      "Locked out? Wait out the cooldown or write to support from the address on the account",
    ],
    platforms: ["web", "windows", "macos", "android", "ios", "linux"],
    links: [{ label: "Open your profile", href: "/profile" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "installation-updates",
    section: "troubleshooting",
    title: "Installation & updates",
    blurb:
      "Fix App Store errors, desktop installer glitches and stubborn cached builds.",
    bullets: [
      "Store errors: update your OS and app store, then reinstall from your download history",
      "Desktop installers: allow the signed app through SmartScreen / Gatekeeper extras",
      "Web apps: hard refresh (Ctrl/Cmd + Shift + R) clears stale cached builds",
    ],
    platforms: ["windows", "macos", "android", "ios", "web"],
    links: [{ label: "Download history", href: "/profile" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "device-permissions",
    section: "troubleshooting",
    title: "Device permissions",
    blurb:
      "Enable camera, microphone, notifications or local storage per operating system.",
    bullets: [
      "Windows / macOS: system settings, then the app permission pane",
      "Android / iOS: permissions live in the app settings screen",
      "Web apps: answer the browser prompt in the address bar — revoke it there too",
    ],
    platforms: ["web", "windows", "macos", "android", "ios", "linux"],
    lastReviewed: "Aug 2026",
  },
  {
    id: "bug-crash-reporting",
    section: "troubleshooting",
    title: "Bug & crash reporting",
    blurb:
      "Locate, export and submit system logs and error codes — the fast way to get things fixed.",
    bullets: [
      "Error codes appear in the app dialog or browser console — copy them",
      "Desktop apps keep logs in their app folder; stores can export crash logs",
      "Send the code, the OS and what you did via the contact form below",
    ],
    platforms: ["web", "windows", "macos", "android", "ios", "linux"],
    links: [{ label: "Jump to contact", href: "#contact" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "where-downloads-go",
    section: "troubleshooting",
    title: "Where downloads land",
    blurb:
      "Know exactly where each platform puts the files, so nothing feels 'lost'.",
    bullets: [
      "Windows / macOS / Linux: your browser Downloads folder by default",
      "Android / iOS: store downloads live inside the app",
      "Change the default folder in your browser settings before downloading",
    ],
    platforms: ["windows", "macos", "linux", "android", "ios"],
    lastReviewed: "Aug 2026",
  },
  {
    id: "redownload-history",
    section: "troubleshooting",
    title: "Re-download & download history",
    blurb: "Grab any app again from your account — no need to remember links.",
    bullets: [
      "Sign in at your profile to see every app you have downloaded",
      "Re-downloading keeps your settings when you sign in with the same account",
      "Instant-play apps without an account re-download straight from the app page",
    ],
    platforms: ["web", "windows", "macos", "android", "ios", "linux"],
    links: [{ label: "Open your profile", href: "/profile" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "stale-versions-cache",
    section: "troubleshooting",
    title: "Stale versions & cache",
    blurb: "Still seeing an old version number? It is almost always the cache.",
    bullets: [
      "Web apps cache aggressively — hard refresh after an update announcement",
      "Desktop installers replace the previous build in place",
      "Store apps update through the store; newer takes over automatically",
    ],
    platforms: ["web", "windows", "macos", "linux"],
    lastReviewed: "Aug 2026",
  },
  {
    id: "live-system-status",
    section: "transparency",
    title: "System status",
    blurb:
      "Live per-component uptime, incident updates and planned maintenance.",
    bullets: [
      "Per-component status above — API, catalog, site and community, individually",
      "Incidents get timestamped updates on the News timeline until resolved",
      "Planned maintenance is announced at least 72 hours in advance",
    ],
    platforms: [],
    links: [{ label: "Read the news", href: "/news" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "changelog-product-notes",
    section: "transparency",
    title: "Changelog & product notes",
    blurb: "Every version bump, fix and feature, tracked on a public timeline.",
    bullets: [
      "Releases and fixes are announced on the News page as they land",
      "Each app page carries its own per-version changelog",
      "Nothing ships without a note — check the timeline before updating",
    ],
    platforms: [],
    links: [{ label: "Read the news", href: "/news" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "tiered-contact",
    section: "community",
    title: "Contact options",
    blurb:
      "Three ways to reach us, ordered by how little they cost you.",
    bullets: [
      "Fastest: email — a human reads every message",
      "Socials work for quick questions and check-ins",
      "The ticket form is best for structured reports with logs attached",
    ],
    platforms: [],
    links: [{ label: "Jump to contact", href: "#contact" }],
    lastReviewed: "Aug 2026",
  },
  {
    id: "community-forums",
    section: "community",
    title: "Community & forums",
    blurb:
      "Power users answer common questions and share custom setups and scripts.",
    bullets: [
      "The GitHub org hosts issues and discussions for the catalog",
      "Official forums are coming — socials cover the gap until then",
      "Search GitHub issues before posting: chances are someone fixed it already",
    ],
    platforms: [],
    links: [{ label: "GitHub org", href: "https://github.com/2corestudio" }],
    lastReviewed: "Aug 2026",
  },
];