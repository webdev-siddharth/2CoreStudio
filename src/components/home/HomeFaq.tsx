import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes — the core catalog is free with no account required. Premium apps are clearly marked and always optional.",
  },
  {
    q: "Do I need an account?",
    a: "No. Instant-play apps download and run with zero signup. An account is only needed for premium purchases and to keep your download history.",
  },
  {
    q: "Which platforms are supported?",
    a: "Web, Windows, Mac, Android, iOS and Linux. Every app lists its own supported platforms and versions, so you always know what runs where.",
  },
  {
    q: "How do updates work?",
    a: "Each app ships a per-platform version list with changelogs — you can see exactly what changed before you download the next build.",
  },
  {
    q: "Is my data safe?",
    a: "Profiles stay minimal, analytics are anonymous event counts, and everything is locked behind per-user access rules. We collect only what the apps need.",
  },
];

export function HomeFaq() {
  return (
    <section className="border-b-[3px] border-ink bg-surface2">
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            FAQ
          </p>
          <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
            Questions, answered
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={Math.min(i * 60, 180)}>
              <details className="group border-[3px] border-ink bg-surface shadow-[4px_4px_0_var(--ink)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink sm:text-sm">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center border-2 border-ink bg-surface2 text-magenta transition-transform duration-200 group-open:rotate-45"
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
      </div>
    </section>
  );
}