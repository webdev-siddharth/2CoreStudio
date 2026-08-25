export const SITE_NAME = "2coreStudio";

/** Placeholder legal contact — replace with a live, monitored mailbox before launch. */
export const LEGAL_CONTACT_EMAIL = "support@2corestudio.com";

export const LEGAL_LAST_UPDATED = "August 19, 2026";
export const LEGAL_VERSION = "1.0.0";

export type ChangelogEntry = {
  version: string;
  date: string;
  summary: string;
};

export type LegalDoc = {
  slug: "privacy" | "terms" | "cookies";
  href: string;
  title: string;
  kicker: string;
  description: string;
  changelog: ChangelogEntry[];
};

const initialEntry = (doc: string): ChangelogEntry => ({
  version: LEGAL_VERSION,
  date: LEGAL_LAST_UPDATED,
  summary: `Initial publication of the ${doc}.`,
});

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    href: "/legal/privacy",
    title: "Privacy Policy",
    kicker: "Privacy Policy",
    description:
      "What data 2coreStudio collects, how it is used, how long it is kept and how you can request deletion.",
    changelog: [initialEntry("Privacy Policy")],
  },
  {
    slug: "terms",
    href: "/legal/terms",
    title: "Terms of Service",
    kicker: "Terms of Service",
    description:
      "The agreement governing use of 2coreStudio products and services — user responsibilities, acceptable use and limitation of liability.",
    changelog: [initialEntry("Terms of Service")],
  },
  {
    slug: "cookies",
    href: "/legal/cookies",
    title: "Cookie Policy",
    kicker: "Cookie Policy",
    description:
      "Which cookies and site storage 2coreStudio uses, what they do and how you can control them.",
    changelog: [initialEntry("Cookie Policy")],
  },
];

export const LEGAL_HUB_DESCRIPTION =
  "The documents that govern how 2coreStudio products and services are used.";