import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "Is the catalog really free?",
    a: "Yes — the core catalog is free with no account required. Premium apps are clearly marked, and buying one is always optional.",
  },
  {
    q: "Do I need an account to download?",
    a: "No. Instant-play apps download and run with zero signup. An account is only needed for premium purchases and to keep your download history.",
  },
  {
    q: "Which platforms are supported?",
    a: "Web, Windows, Mac, Android, iOS and Linux. Every app lists its own supported platforms and versions, so you always know what runs where.",
  },
  {
    q: "How do updates work?",
    a: "Each app ships a per-platform version list with changelogs, and every release is announced on the News timeline. You can see exactly what changed before you update.",
  },
  {
    q: "How do I restore a purchase?",
    a: "iOS and Android purchases restore from the store receipt — just sign in and restore, no extra charge. Web purchases are tied to your account on the profile page.",
  },
  {
    q: "Why am I still seeing an old version?",
    a: "Almost always the cache. Hard refresh web apps (Ctrl/Cmd + Shift + R) and re-download desktop builds from your download history.",
  },
  {
    q: "Where is my data stored and is it safe?",
    a: "Data is hosted with our providers (Supabase and Cloudflare) and protected by per-user access rules. The short and full versions live on the security page.",
  },
  {
    q: "Still stuck?",
    a: "No problem — email us, or use the form below. A human reads every message, and bug reports with logs get fixed fastest.",
  },
];

export function SupportFaq() {
  return (
    <section id="faq" className="border-b-[3px] border-ink bg-surface2">
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            FAQ
          </p>
          <h2 className="display mt-3 text-3xl text-text sm:text-4xl">
            Questions, answered
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={Math.min(i * 60, 180)}>
              <details className="group border-[3px] border-ink bg-surface shadow-[4px_4px_0_var(--ink)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-text sm:text-sm">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center border-2 border-ink bg-surface2 text-primary transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t-[3px] border-dashed border-ink px-5 py-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="mt-8 font-mono text-xs leading-relaxed text-muted">
            Didn&apos;t find it? The FAQ covers decisions, not every detail —
            search the topics above or{" "}
            <Link
              href="#contact"
              className="font-bold text-primary no-underline hover:text-secondary"
            >
              write to us
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}