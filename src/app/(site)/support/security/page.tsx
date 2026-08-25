import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SECURITY_EMAIL } from "../data";

export const metadata: Metadata = {
  title: "Security & Privacy",
  description:
    "How 2coreStudio protects your data — encryption, residency, access controls and responsible vulnerability disclosure.",
};

const GLANCE = [
  {
    title: "Encrypted in transit",
    body: "Every connection to the site and the API is TLS-encrypted. Storefront and catalog traffic never travels in clear text.",
  },
  {
    title: "Minimal data",
    body: "We collect only what the service needs — account details if you sign up and lightweight download events. Nothing is sold, ever.",
  },
  {
    title: "Per-user access",
    body: "Database access is locked behind per-user rules. Nobody at the studio browses your profile; operator access happens only when you ask us to fix something.",
  },
  {
    title: "Built on audited providers",
    body: "The stack runs on Supabase (Postgres and Auth) and Cloudflare (edge network) — both operated by teams whose business is secure infrastructure.",
  },
];

const DISCLOSURE = [
  "Report privately — write directly to the security mailbox, not public channels.",
  "Include steps to reproduce, the affected component and any error output.",
  "We confirm receipt within 5 business days and keep you posted on the fix.",
  "No automated scanning, credential-stuffing or DoS attempts — we take down, not attack.",
  "There is no bug bounty yet. When one launches, credit and a shout-out are the deal until then.",
  "We publish disclosed incidents on this page after they are fixed.",
];

const HISTORY = [
  { date: "Aug 2026", title: "No incidents disclosed to date", body: "We will keep this list honest and up to date. Trust is built in the clear, including when something goes wrong." },
];

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {kicker}
      </p>
      <h2 className="display mt-3 text-3xl text-text sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          2coreStudio trust center
        </p>
        <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
          SECURITY <span className="text-primary">/</span> PRIVACY
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
          The short version: we collect as little as the service needs, we
          never sell it, and everything is encrypted in transit. This page is
          the full story — including what we do not claim.
        </p>
      </Reveal>

      {/* At a glance */}
      <section aria-label="At a glance" className="mt-10">
        <SectionHeading kicker="The short version" title="At a glance" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GLANCE.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <h3 className="display text-base text-text">{item.title}</h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Detailed notes */}
      <section aria-label="How we protect data" className="mt-14">
        <SectionHeading kicker="The details" title="How data is protected" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="nb-card h-full">
              <h3 className="display text-base text-text">Encryption</h3>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                <span className="font-bold text-text">In transit:</span> all
                traffic uses TLS between your device, the site and the API.
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                <span className="font-bold text-text">At rest:</span> databases
                and backups are stored encrypted by our hosting providers
                (Supabase Postgres and Cloudflare storage). Passwords are never
                stored in plain text — sign-in uses hashes and magic links.
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                <span className="font-bold text-text">On your device:</span>{" "}
                nothing leaves the browser except the data you choose to send.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="nb-card h-full">
              <h3 className="display text-base text-text">Data residency</h3>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                Your data is hosted with our infrastructure providers — Supabase
                for the database and auth, and the Cloudflare edge network which
                serves this site. As with any hosted service, server and edge
                logs may briefly hold basic technical details (IP address, user
                agent, request times) used for security and availability.
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                The exact regions are listed in the{" "}
                <Link
                  href="/legal/privacy"
                  className="font-bold text-primary no-underline hover:text-secondary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </Reveal>
          <Reveal delay={40}>
            <div className="nb-card h-full">
              <h3 className="display text-base text-text">Access controls</h3>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                Every row in the database is gated by per-user rules (RLS) —
                signed-in users see only their own profile and history, and
                unpublished content stays invisible to visitors. Operator
                access is granted only when you ask us to fix something, and it
                is scoped to that task.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="nb-card h-full">
              <h3 className="display text-base text-text">Certifications & audits</h3>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                We do not currently hold formal certifications (SOC 2, ISO
                27001) and have not had third-party penetration tests — the
                studio is small and honest about that. What we can claim: a
                minimal-data model, per-user access rules, and infrastructure
                providers whose own security programs are audited. The moment
                that changes, it gets posted right here.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vulnerability disclosure */}
      <section
        aria-label="Vulnerability disclosure"
        className="relative left-1/2 mt-14 w-[100vw] -translate-x-1/2"
      >
        <div className="bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)] py-7">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="border-[3px] border-ink bg-bg px-6 py-12 shadow-[8px_8px_0_var(--ink)] sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Responsible disclosure
                </p>
                <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
                  Found a hole? Tell us first
                </h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {DISCLOSURE.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-mono text-xs leading-relaxed text-text"
                    >
                      <span aria-hidden className="text-primary">
                        →
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={`mailto:${SECURITY_EMAIL}`} className="nb-btn mt-8">
                  {SECURITY_EMAIL} →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Incident history */}
      <section aria-label="Incident history" className="mt-14">
        <SectionHeading kicker="Transparency log" title="Incident history" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HISTORY.map((incident, i) => (
            <Reveal key={incident.title} delay={i * 80}>
              <div className="nb-card flex h-full flex-col">
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  {incident.date}
                </p>
                <h3 className="display mt-2 text-base text-text">
                  {incident.title}
                </h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                  {incident.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Legal links */}
      <section aria-label="Legal documents" className="mt-14">
        <Reveal>
          <div className="nb-card flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs leading-relaxed text-muted">
              The full legal story lives alongside this page.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/legal/privacy" className="nb-btn nb-btn--secondary">
                Privacy Policy →
              </Link>
              <Link href="/legal/terms" className="nb-btn nb-btn--secondary">
                Terms of Service →
              </Link>
              <Link href="/legal/cookies" className="nb-btn nb-btn--secondary">
                Cookie Policy →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}