import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import { SupportHub } from "./SupportHub";
import { SupportFaq } from "./SupportFaq";
import { SupportStatus, type InfraStatus } from "./SupportStatus";
import { SupportContact } from "./SupportContact";
import { SECURITY_EMAIL } from "./data";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with 2coreStudio software — downloads, accounts, billing, system status and troubleshooting guides.",
};

async function getInfraStatus(): Promise<InfraStatus> {
  if (isUnconfiguredSupabase()) return "unconfigured";
  try {
    const supabase = await createClient();
    const { error } = await withTimeout(
      supabase.from("apps").select("id", { count: "exact", head: true })
    );
    return error ? "degraded" : "operational";
  } catch (err) {
    console.error("Support status probe threw:", err);
    return "degraded";
  }
}

const SECURITY_POINTS = [
  {
    title: "Encrypted everywhere",
    body: "TLS in transit, encrypted storage at rest, hashed passwords.",
  },
  {
    title: "Minimal by design",
    body: "Only what the service needs — and it is never sold or shared.",
  },
  {
    title: "You stay in control",
    body: "Per-user access rules, deletion on request, no dark patterns.",
  },
];

export default async function SupportPage() {
  const status = await getInfraStatus();

  return (
    <div>
      {/* Hero + topic hub */}
      <section aria-label="Support" className="bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              2coreStudio help desk
            </p>
            <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
              SUPPORT <span className="text-primary">/</span> HELP DESK
            </h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
              Search a topic, filter by platform, or jump straight to
              contact. Most questions are answered here in thirty seconds or
              less.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <SupportHub />
          </Reveal>
        </div>
      </section>

      {/* Security - short version */}
      <section aria-label="Security" className="border-b-[3px] border-ink bg-surface2">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Trust center
                </p>
                <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
                  Security & privacy
                </h2>
              </div>
              <Link href="/support/security" className="nb-btn">
                Full security notes →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SECURITY_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 60}>
                <div className="nb-card h-full">
                  <h3 className="display text-sm text-text">{point.title}</h3>
                  <p className="mt-2 text-[0.72rem] leading-relaxed text-muted">
                    {point.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-6 font-mono text-xs leading-relaxed text-muted">
              Found a vulnerability? Write to{" "}
              <a
                href={`mailto:${SECURITY_EMAIL}`}
                className="font-bold text-primary no-underline hover:text-secondary"
              >
                {SECURITY_EMAIL}
              </a>{" "}
              — full disclosure policy on the security page.
            </p>
          </Reveal>
        </div>
      </section>

      <SupportFaq />

      <SupportStatus status={status} />

      <SupportContact />

      {/* CTA band */}
      <section
        aria-label="Get started"
        className="relative left-1/2 w-[100vw] -translate-x-1/2"
      >
        <div className="bg-[repeating-linear-gradient(45deg,var(--primary),var(--primary)_10px,var(--secondary)_10px,var(--secondary)_20px)] py-7">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="border-[3px] border-ink bg-surface px-6 py-12 text-center shadow-[8px_8px_0_var(--ink)] sm:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Sorted?
                </p>
                <h2 className="display mt-3 text-4xl text-text sm:text-5xl">
                  Back to the good stuff
                </h2>
                <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-text">
                  Solved, or just looking around? The catalog is open — six
                  platforms, fresh drops every week.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/apps" className="nb-btn">
                    Browse all software →
                  </Link>
                  <Link href="/news" className="nb-btn nb-btn--secondary">
                    Read the news →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}